import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getOrCreateCart, calculateTotals } from "@/lib/cart"
import { guestCheckoutSchema, normalizeSaudiMobile } from "@/lib/validation"
import { generateOrderNumber, generateTrackingToken } from "@/lib/order"
import { DEFAULT_SETTINGS } from "@/lib/settings"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = guestCheckoutSchema.safeParse(body)

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message
    }
    return NextResponse.json({ fieldErrors }, { status: 400 })
  }

  const cart = await getOrCreateCart()
  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
  }

  // re-check stock at checkout time (it may have changed since the cart was filled)
  for (const item of cart.items) {
    const fresh = await prisma.productVariant.findUnique({ where: { id: item.variantId } })
    if (!fresh || fresh.stock < item.quantity) {
      return NextResponse.json(
        { error: `"${item.product.nameEn}" no longer has enough stock. Please update your cart.` },
        { status: 409 },
      )
    }
  }

  const data = parsed.data
  const mobile = normalizeSaudiMobile(data.mobile)

  const address = await prisma.address.create({
    data: {
      fullName: data.fullName,
      mobile,
      email: data.email || null,
      city: data.city,
      district: data.district,
      street: data.street,
      buildingNo: data.buildingNo || null,
      notes: data.notes || null,
    },
  })

  const items = cart.items.map((i) => ({ priceSar: Number(i.variant.priceSar), quantity: i.quantity }))
  const totals = calculateTotals(items, {
    shippingSar: DEFAULT_SETTINGS.shipping.flatRateSar,
    vatRatePercent: DEFAULT_SETTINGS.vatRatePercent,
  })

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        trackingToken: generateTrackingToken(),
        guestFullName: data.fullName,
        guestMobile: mobile,
        guestEmail: data.email || null,
        addressId: address.id,
        subtotalSar: totals.subtotal,
        shippingSar: totals.shipping,
        taxSar: totals.tax,
        discountSar: totals.discount,
        totalSar: totals.total,
        status: "PENDING_PAYMENT",
        paymentStatus: "UNPAID",
        items: {
          create: cart.items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            nameEnSnap: i.product.nameEn,
            nameArSnap: i.product.nameAr,
            sizeSnap: i.variant.size,
            priceSarSnap: i.variant.priceSar,
            quantity: i.quantity,
          })),
        },
      },
    })

    // reserve stock immediately so two guests can't oversell the same unit
    // while payment is pending (released/confirmed once a gateway is wired)
    for (const i of cart.items) {
      await tx.productVariant.update({
        where: { id: i.variantId },
        data: { stock: { decrement: i.quantity } },
      })
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

    return created
  })

  return NextResponse.json({ orderNumber: order.orderNumber, trackingToken: order.trackingToken })
}
