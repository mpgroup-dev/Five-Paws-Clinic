import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminSession } from "@/lib/adminAuth"
import { nanoid } from "nanoid"

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  if (!body.nameEn || !body.nameAr || !body.priceSar) {
    return NextResponse.json({ error: "Name (EN/AR) and price are required" }, { status: 400 })
  }

  let slug = slugify(body.nameEn)
  const clash = await prisma.product.findUnique({ where: { slug } })
  if (clash) slug = `${slug}-${nanoid(6)}`

  const product = await prisma.product.create({
    data: {
      nameEn: body.nameEn,
      nameAr: body.nameAr,
      slug,
      status: "DRAFT",
      needsReview: true,
      reviewNote: "Newly created — add image, category and brand before activating.",
      variants: {
        create: [{ sku: `${slug.toUpperCase()}-STD`, priceSar: Number(body.priceSar), stock: Number(body.stock ?? 0), isDefault: true }],
      },
    },
  })

  return NextResponse.json({ id: product.id }, { status: 201 })
}
