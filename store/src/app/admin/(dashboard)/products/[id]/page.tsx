import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductEditForm from "@/components/admin/ProductEditForm"

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { variants: true, images: true } }),
    prisma.category.findMany({ include: { children: true }, where: { parentId: null }, orderBy: { sortOrder: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ])
  if (!product) notFound()

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Edit Product</h1>
      <ProductEditForm
        product={{
          ...product,
          variants: product.variants.map((v) => ({ ...v, priceSar: Number(v.priceSar), compareAtSar: v.compareAtSar ? Number(v.compareAtSar) : null })),
        }}
        categories={categories}
        brands={brands}
      />
    </div>
  )
}
