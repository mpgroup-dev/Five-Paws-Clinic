import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Truck, ShieldCheck, Star } from "lucide-react"
import { getDictionary, isValidLocale } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CATEGORY_TAXONOMY } from "../../../prisma/categoryTaxonomy"
import ProductCard from "@/components/ProductCard"

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const dict = getDictionary(locale)

  const [featured, newArrivals, bestSellers, brands] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      include: { variants: true, images: true, brand: true },
      take: 8,
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { variants: true, images: true, brand: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE", isBestSeller: true },
      include: { variants: true, images: true, brand: true },
      take: 8,
    }),
    prisma.brand.findMany({ take: 10 }),
  ])

  const featuredOrFallback = featured.length ? featured : newArrivals.slice(0, 8)
  const bestSellersOrFallback = bestSellers.length ? bestSellers : newArrivals.slice(0, 8)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-tint to-background py-16 sm:py-24">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-dark shadow-sm">
              <Star size={14} className="fill-accent text-accent" /> 4.8/5 {locale === "ar" ? "تقييم العملاء" : "Customer Rating"}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-4 max-w-md text-foreground/70">{dict.home.heroSubtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors"
              >
                <ShoppingBag size={18} /> {dict.home.shopNow}
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
              <Feature icon={<Truck size={20} />} text={locale === "ar" ? "توصيل لكل السعودية" : "Nationwide KSA Delivery"} />
              <Feature icon={<ShieldCheck size={20} />} text={locale === "ar" ? "دفع آمن" : "Secure Checkout"} />
              <Feature icon={<Star size={20} />} text={locale === "ar" ? "منتجات أصلية" : "100% Genuine Products"} />
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl">
            {newArrivals[0]?.images[0]?.url ? (
              <Image src={newArrivals[0].images[0].url} alt="" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">🐾</div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-14">
        <h2 className="mb-6 text-2xl font-bold text-brand-dark">{dict.home.shopByCategory}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORY_TAXONOMY.map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/products?category=${c.slug}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-white p-4 text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"
            >
              <span className="text-3xl">{CATEGORY_EMOJI[c.slug] ?? "🐾"}</span>
              <span className="text-sm font-semibold">{locale === "ar" ? c.nameAr : c.nameEn}</span>
            </Link>
          ))}
        </div>
      </section>

      <ProductRow title={dict.home.bestSellers} products={bestSellersOrFallback} locale={locale} dict={dict} viewAllHref={`/${locale}/products?sort=best-selling`} />
      <ProductRow title={dict.home.newArrivals} products={newArrivals} locale={locale} dict={dict} viewAllHref={`/${locale}/products?sort=newest`} />
      <ProductRow title={dict.home.featured} products={featuredOrFallback} locale={locale} dict={dict} viewAllHref={`/${locale}/products`} />

      {/* Popular brands */}
      {brands.length > 0 && (
        <section className="container-page py-14">
          <h2 className="mb-6 text-2xl font-bold text-brand-dark">{dict.home.popularBrands}</h2>
          <div className="flex flex-wrap gap-3">
            {brands.map((b) => (
              <Link
                key={b.id}
                href={`/${locale}/products?brand=${encodeURIComponent(b.name)}`}
                className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold hover:border-brand hover:text-brand-dark"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-brand-dark py-14 text-white">
        <div className="container-page flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold">{dict.home.newsletterTitle}</h2>
          <p className="mt-2 max-w-md text-white/80">{dict.home.newsletterSubtitle}</p>
          <form className="mt-6 flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              placeholder={dict.home.newsletterPlaceholder}
              className="flex-1 rounded-full px-4 py-3 text-foreground outline-none"
            />
            <button className="rounded-full bg-accent px-6 py-3 font-bold text-white hover:bg-accent-dark">
              {dict.home.newsletterCta}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

const CATEGORY_EMOJI: Record<string, string> = {
  cats: "🐱",
  dogs: "🐶",
  birds: "🦜",
  "fish-aquatic": "🐠",
  "healthcare-grooming": "🧴",
  "toys-accessories": "🧸",
  "cat-litter": "🧹",
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span className="text-brand">{icon}</span>
      <span className="text-xs font-medium text-foreground/70">{text}</span>
    </div>
  )
}

function ProductRow({
  title,
  products,
  locale,
  dict,
  viewAllHref,
}: {
  title: string
  products: any[]
  locale: string
  dict: ReturnType<typeof getDictionary>
  viewAllHref: string
}) {
  if (!products.length) return null
  return (
    <section className="container-page py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-dark">{title}</h2>
        <Link href={viewAllHref} className="text-sm font-semibold text-brand hover:underline">
          {dict.home.viewAll}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale as "en" | "ar"} dict={dict} />
        ))}
      </div>
    </section>
  )
}
