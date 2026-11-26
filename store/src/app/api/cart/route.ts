import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getOrCreateCart } from "@/lib/cart"

const addSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().min(1).max(99).default(1),
})

export async function GET() {
  const cart = await getOrCreateCart()
  return NextResponse.json(cart)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = addSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { productId, variantId, quantity } = parsed.data

  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } })
  if (!variant || variant.productId !== productId) {
    return NextResponse.json({ error: "Variant not found" }, { status: 404 })
  }
  if (variant.stock < quantity) {
    return NextResponse.json({ error: "Insufficient stock" }, { status: 409 })
  }

  const cart = await getOrCreateCart()
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  })

  let item
  if (existing) {
    item = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: Math.min(existing.quantity + quantity, variant.stock) },
    })
  } else {
    item = await prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId, quantity },
    })
  }

  return NextResponse.json(item, { status: 201 })
}

const updateSchema = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(0).max(99),
})

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const cart = await getOrCreateCart()
  const item = await prisma.cartItem.findUnique({ where: { id: parsed.data.itemId } })
  if (!item || item.cartId !== cart.id) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (parsed.data.quantity === 0) {
    await prisma.cartItem.delete({ where: { id: item.id } })
    return NextResponse.json({ ok: true })
  }

  const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } })
  const quantity = Math.min(parsed.data.quantity, variant?.stock ?? parsed.data.quantity)
  const updated = await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get("itemId")
  if (!itemId) return NextResponse.json({ error: "itemId required" }, { status: 400 })

  const cart = await getOrCreateCart()
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } })
  if (!item || item.cartId !== cart.id) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.cartItem.delete({ where: { id: itemId } })
  return NextResponse.json({ ok: true })
}
