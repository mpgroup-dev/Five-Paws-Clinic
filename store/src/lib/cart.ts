import { cookies } from "next/headers"
import { nanoid } from "nanoid"
import { Prisma } from "@prisma/client"
import { prisma } from "./prisma"

const GUEST_CART_COOKIE = "fps_guest_cart"

type CartWithItems = Prisma.CartGetPayload<{
  include: { items: { include: { product: true; variant: true } } }
}>

const EMPTY_CART: CartWithItems = {
  id: "",
  guestToken: null,
  customerId: null,
  createdAt: new Date(0),
  updatedAt: new Date(0),
  items: [],
}

/**
 * Read-only lookup, safe to call from Server Components (layouts/pages).
 * Never creates a cart or sets a cookie — Next.js forbids mutating cookies
 * outside a Server Action or Route Handler. If no guest cart exists yet,
 * returns an empty cart shape instead.
 */
export async function getCurrentCart() {
  const store = await cookies()
  const token = store.get(GUEST_CART_COOKIE)?.value
  if (!token) return EMPTY_CART

  const existing = await prisma.cart.findUnique({
    where: { guestToken: token },
    include: { items: { include: { product: true, variant: true } } },
  })
  return existing ?? EMPTY_CART
}

/**
 * Returns the current request's cart, creating a guest cart (tied to a
 * long-lived cookie, not an account) if none exists yet. Only call this from
 * a Route Handler (API route) or Server Action — it writes a cookie, which
 * Next.js only allows in those contexts.
 */
export async function getOrCreateCart() {
  const store = await cookies()
  let token = store.get(GUEST_CART_COOKIE)?.value

  if (token) {
    const existing = await prisma.cart.findUnique({
      where: { guestToken: token },
      include: { items: { include: { product: true, variant: true } } },
    })
    if (existing) return existing
  }

  token = nanoid(24)
  const cart = await prisma.cart.create({
    data: { guestToken: token },
    include: { items: { include: { product: true, variant: true } } },
  })

  store.set(GUEST_CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90 days
  })

  return cart
}

export function calculateTotals(
  items: { priceSar: number; quantity: number }[],
  opts: { shippingSar: number; vatRatePercent: number; discountSar?: number },
) {
  const subtotal = items.reduce((sum, i) => sum + i.priceSar * i.quantity, 0)
  const discount = opts.discountSar ?? 0
  const taxable = Math.max(subtotal - discount, 0)
  const tax = Math.round(taxable * (opts.vatRatePercent / 100) * 100) / 100
  const shipping = subtotal - discount >= 0 ? opts.shippingSar : opts.shippingSar
  const total = Math.round((taxable + tax + shipping) * 100) / 100
  return { subtotal, discount, tax, shipping, total }
}
