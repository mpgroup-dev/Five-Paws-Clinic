import { getDictionary, isValidLocale } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Prisma, AnimalType } from "@prisma/client"
import ProductCard from "@/components/ProductCard"
import ProductFilters from "@/components/ProductFilters"

type SearchParams = {
  q?: string
  category?: string
  brand?: string
  animal?: string
  minPrice?: string
  maxPrice?: string
  inStock?: string
  sort?: string
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const sp = await searchParams

  const where: Prisma.ProductWhereInput = { status: "ACTIVE" }

  if (sp.q) {
    where.OR = [
      { nameEn: { contains: sp.q, mode: "insensitive" } },
      { nameAr: { contains: sp.q, mode: "insensitive" } },
      { brand: { name: { contains: sp.q, mode: "insensitive" } } },
    ]
  }
  if (sp.category) {
    where.category = { OR: [{ slug: sp.category }, { parent: { slug: sp.category } }] }
  }
  if (sp.brand) {
    where.brand = { name: sp.brand }
  }
  if (sp.animal && sp.animal in AnimalType) {
    where.animalType = sp.animal as AnimalType
  }
  if (sp.inStock === "1") {
    where.variants = { some: { stock: { gt: 0 } } }
  }
  if (sp.minPrice || sp.maxPrice) {
    where.variants = {
      some: {
        priceSar: {
          gte: sp.minPrice ? Number(sp.minPrice) : undefined,
          lte: sp.maxPrice ? Number(sp.maxPrice) : undefined,
        },
      },
    }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }
  if (sp.sort === "price-asc") orderBy = { variants: { _count: "asc" } } // placeholder; real sort below
  if (sp.sort === "alphabetical") orderBy = { nameEn: "asc" }
  if (sp.sort === "best-selling") orderBy = { isBestSeller: "desc" }

  const [products, brands, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { variants: true, images: true, brand: true, category: true },
      orderBy,
      take: 60,
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ where: { parentId: null }, include: { children: true }, orderBy: { sortOrder: "asc" } }),
  ])

  // price sort needs the computed min variant price, done in JS for simplicity
  let sorted = products
  if (sp.sort === "price-asc" || sp.sort === "price-desc") {
    const withMin = products.map((p) => ({
      p,
      min: Math.min(...p.variants.map((v) => Number(v.priceSar))),
    }))
    withMin.sort((a, b) => (sp.sort === "price-asc" ? a.min - b.min : b.min - a.min))
    sorted = withMin.map((x) => x.p)
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">{dict.nav.shop}</h1>
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <ProductFilters locale={locale} dict={dict} brands={brands} categories={categories} searchParams={sp} />
        <div>
          <p className="mb-4 text-sm text-foreground/60">
            {dict.filters.resultsCount.replace("{count}", String(sorted.length))}
          </p>
          {sorted.length === 0 ? (
            <p className="rounded-xl border border-dashed border-black/10 p-10 text-center text-foreground/60">
              {dict.filters.noResults}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {sorted.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale as "en" | "ar"} dict={dict} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
