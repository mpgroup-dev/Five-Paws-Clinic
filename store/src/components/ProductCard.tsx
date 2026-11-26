import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import type { Locale } from "@/i18n/dictionaries"
import { getDictionary } from "@/i18n/getDictionary"

type VariantLite = { priceSar: unknown; stock: number; size: string | null }
type ProductLite = {
  id: string
  slug: string
  nameEn: string
  nameAr: string
  brand?: { name: string } | null
  images: { url: string }[]
  variants: VariantLite[]
}

export default function ProductCard({
  product,
  locale,
  dict,
}: {
  product: ProductLite
  locale: Locale
  dict: ReturnType<typeof getDictionary>
}) {
  const name = locale === "ar" ? product.nameAr : product.nameEn
  const prices = product.variants.map((v) => Number(v.priceSar))
  const minPrice = prices.length ? Math.min(...prices) : null
  const inStock = product.variants.some((v) => v.stock > 0)
  const image = product.images[0]?.url

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        className="absolute end-2 top-2 z-10 rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
        aria-label={dict.nav.wishlist}
        type="button"
      >
        <Heart size={16} />
      </button>
      <Link href={`/${locale}/products/${product.slug}`} className="block aspect-square bg-brand-tint/40">
        {image ? (
          <div className="relative h-full w-full">
            <Image src={image} alt={name} fill className="object-contain p-3" />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">🐾</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        {product.brand && <span className="text-xs font-medium text-foreground/50">{product.brand.name}</span>}
        <Link href={`/${locale}/products/${product.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-brand-dark">
          {name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-brand-dark">
            {minPrice !== null ? `${minPrice.toFixed(2)} ${dict.common.sar}` : "—"}
          </span>
          <span className={`text-xs font-semibold ${inStock ? "text-emerald-600" : "text-red-500"}`}>
            {inStock ? dict.product.inStock : dict.product.outOfStock}
          </span>
        </div>
      </div>
    </div>
  )
}
