import { notFound } from "next/navigation"
import Image from "next/image"
import { isValidLocale, getDictionary } from "@/i18n/getDictionary"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import AddToCartForm from "@/components/AddToCartForm"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()
  const dict = getDictionary(locale)

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: { orderBy: { priceSar: "asc" } }, images: true, brand: true, category: true },
  })
  if (!product || product.status !== "ACTIVE") notFound()

  const related = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { variants: true, images: true, brand: true },
    take: 4,
  })

  const name = locale === "ar" ? product.nameAr : product.nameEn
  const description = locale === "ar" ? product.descriptionAr : product.descriptionEn

  return (
    <div className="container-page py-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-3xl bg-brand-tint/40">
          {product.images[0] ? (
            <div className="relative h-full w-full">
              <Image src={product.images[0].url} alt={name} fill className="object-contain p-6" />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-7xl">🐾</div>
          )}
        </div>

        <div>
          {product.brand && <p className="text-sm font-semibold text-brand">{product.brand.name}</p>}
          <h1 className="mt-1 text-2xl font-bold">{name}</h1>
          <p className="mt-1 text-sm text-foreground/50">{locale === "ar" ? product.nameEn : product.nameAr}</p>

          <AddToCartForm
            productId={product.id}
            variants={product.variants.map((v) => ({
              id: v.id,
              size: v.size,
              priceSar: Number(v.priceSar),
              stock: v.stock,
            }))}
            locale={locale as "en" | "ar"}
            dict={dict}
          />

          {description && (
            <div className="mt-8 border-t border-black/5 pt-6">
              <h2 className="mb-2 font-bold">{dict.product.description}</h2>
              <p className="text-sm text-foreground/70">{description}</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-brand-dark">{dict.product.relatedProducts}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale as "en" | "ar"} dict={dict} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
