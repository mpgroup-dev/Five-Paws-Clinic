import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminSession } from "@/lib/adminAuth"
import fs from "node:fs/promises"
import path from "node:path"
import { nanoid } from "nanoid"

const ALLOWED = ["image/jpeg", "image/png", "image/webp"]

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await req.formData()
  const file = form.get("file") as File | null
  const productId = form.get("productId") as string | null
  if (!file || !productId) return NextResponse.json({ error: "file and productId required" }, { status: 400 })
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Unsupported image type" }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image too large (max 5MB)" }, { status: 400 })

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
  const filename = `${nanoid(12)}.${ext}`
  const dir = path.resolve(process.cwd(), "public/products")
  await fs.mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(dir, filename), buffer)

  const image = await prisma.productImage.create({
    data: { productId, url: `/products/${filename}`, sortOrder: 0 },
  })

  return NextResponse.json(image, { status: 201 })
}
