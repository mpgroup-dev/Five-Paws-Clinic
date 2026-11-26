import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const sp = await searchParams
  const where: Record<string, unknown> = {}
  if (sp.status) where.status = sp.status
  if (sp.q) {
    where.OR = [
      { nameEn: { contains: sp.q, mode: "insensitive" } },
      { nameAr: { contains: sp.q, mode: "insensitive" } },
    ]
  }

  const products = await prisma.product.findMany({
    where,
    include: { variants: true, images: true, brand: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  const counts = await prisma.product.groupBy({ by: ["status"], _count: true })
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-dark">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white">
          + Add Product
        </Link>
      </div>

      <div className="mb-4 flex gap-2 text-sm">
        {["ACTIVE", "DRAFT", "OUT_OF_STOCK", "ARCHIVED"].map((s) => (
          <Link
            key={s}
            href={`/admin/products?status=${s}`}
            className={`rounded-full px-3 py-1.5 font-semibold ${sp.status === s ? "bg-brand text-white" : "bg-brand-tint text-brand-dark"}`}
          >
            {s} ({countMap[s] ?? 0})
          </Link>
        ))}
        <Link href="/admin/products" className={`rounded-full px-3 py-1.5 font-semibold ${!sp.status ? "bg-brand text-white" : "bg-brand-tint text-brand-dark"}`}>
          All
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-black/5 bg-brand-tint/40">
            <tr>
              {["", "Name (EN)", "Name (AR)", "Brand", "Category", "Price Range", "Stock", "Status", ""].map((h) => (
                <th key={h} className="p-3 text-start font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const prices = p.variants.map((v) => Number(v.priceSar))
              const stock = p.variants.reduce((s, v) => s + v.stock, 0)
              return (
                <tr key={p.id} className="border-b border-black/5 last:border-0">
                  <td className="p-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded bg-brand-tint/50">
                      {p.images[0] && <Image src={p.images[0].url} alt="" fill className="object-contain" />}
                    </div>
                  </td>
                  <td className="p-3 font-medium">{p.nameEn}</td>
                  <td className="p-3" dir="rtl">{p.nameAr}</td>
                  <td className="p-3">{p.brand?.name ?? "—"}</td>
                  <td className="p-3">{p.category?.nameEn ?? "—"}</td>
                  <td className="p-3">{prices.length ? `${Math.min(...prices)}–${Math.max(...prices)} SAR` : "—"}</td>
                  <td className="p-3">{stock}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      p.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {p.status}
                    </span>
                    {p.needsReview && <p className="mt-1 text-xs text-amber-600">{p.reviewNote}</p>}
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/products/${p.id}`} className="font-semibold text-brand hover:underline">Edit</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
