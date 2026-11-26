import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminSession } from "@/lib/adminAuth"

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const coupon = await prisma.coupon.create({
    data: {
      code: String(body.code).toUpperCase(),
      percentOff: body.percentOff ? Number(body.percentOff) : null,
      amountOffSar: body.amountOffSar ? Number(body.amountOffSar) : null,
      minOrderSar: body.minOrderSar ? Number(body.minOrderSar) : null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  })
  return NextResponse.json(coupon, { status: 201 })
}
