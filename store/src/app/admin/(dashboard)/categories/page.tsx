import { prisma } from "@/lib/prisma"

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: { include: { _count: { select: { products: true } } } }, _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Categories</h1>
      <div className="space-y-4">
        {categories.map((c) => (
          <div key={c.id} className="rounded-xl border border-black/5 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{c.nameEn} <span className="text-foreground/50" dir="rtl">({c.nameAr})</span></h2>
              <span className="text-sm text-foreground/50">{c._count.products} products</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {c.children.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg bg-brand-tint/40 px-3 py-2 text-sm">
                  <span>{s.nameEn}</span>
                  <span className="text-xs text-foreground/50">{s._count.products}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-foreground/50">
        The category tree matches the taxonomy the client specified. Renaming/adding is supported in the
        database (Category table) — a dedicated add/edit UI can be layered on here next if needed.
      </p>
    </div>
  )
}
