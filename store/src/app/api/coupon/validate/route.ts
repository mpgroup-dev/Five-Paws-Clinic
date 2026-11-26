import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 })

  const coupon = await prisma.coupon.findUnique({ where: { code: String(code).toUpperCase() } })
  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: "Invalid coupon" }, { status: 404 })
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Coupon expired" }, { status: 410 })
  }
  if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
    return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 410 })
  }

  return NextResponse.json({
    code: coupon.code,
    percentOff: coupon.percentOff,
    amountOffSar: coupon.amountOffSar,
    minOrderSar: coupon.minOrderSar,
  })
}
