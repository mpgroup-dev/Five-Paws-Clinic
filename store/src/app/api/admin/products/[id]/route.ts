import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminSession } from "@/lib/adminAuth"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { variants, ...productFields } = body

  await prisma.product.update({
    where: { id },
    data: {
      nameEn: productFields.nameEn,
      nameAr: productFields.nameAr,
      descriptionEn: productFields.descriptionEn || null,
      descriptionAr: productFields.descriptionAr || null,
      categoryId: productFields.categoryId || null,
      brandId: productFields.brandId || null,
      animalType: productFields.animalType,
      status: productFields.status,
    },
  })

  if (Array.isArray(variants)) {
    for (const v of variants) {
      await prisma.productVariant.update({
        where: { id: v.id },
        data: { size: v.size || null, priceSar: v.priceSar, stock: v.stock },
      })
    }
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
