"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import type { Locale } from "@/i18n/dictionaries"
import { getDictionary } from "@/i18n/getDictionary"

type Category = { id: string; slug: string; nameEn: string; nameAr: string; children: { id: string; slug: string; nameEn: string; nameAr: string }[] }
type Brand = { id: string; name: string }

const ANIMAL_TYPES = ["CAT", "DOG", "CAT_AND_DOG", "BIRD", "FISH", "TURTLE", "SMALL_PET"] as const
const ANIMAL_LABEL_EN: Record<string, string> = {
  CAT: "Cat", DOG: "Dog", CAT_AND_DOG: "Cat & Dog", BIRD: "Bird", FISH: "Fish", TURTLE: "Turtle", SMALL_PET: "Small Pet",
}
const ANIMAL_LABEL_AR: Record<string, string> = {
  CAT: "قطة", DOG: "كلب", CAT_AND_DOG: "قطة وكلب", BIRD: "طائر", FISH: "سمكة", TURTLE: "سلحفاة", SMALL_PET: "حيوان صغير",
}

export default function ProductFilters({
  locale,
  dict,
  brands,
  categories,
  searchParams,
}: {
  locale: Locale
  dict: ReturnType<typeof getDictionary>
  brands: Brand[]
  categories: Category[]
  searchParams: Record<string, string | undefined>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState({
    category: searchParams.category ?? "",
    brand: searchParams.brand ?? "",
    animal: searchParams.animal ?? "",
    minPrice: searchParams.minPrice ?? "",
    maxPrice: searchParams.maxPrice ?? "",
    inStock: searchParams.inStock === "1",
    sort: searchParams.sort ?? "",
  })

  function apply(next: Partial<typeof state>) {
    const merged = { ...state, ...next }
    setState(merged)
    const params = new URLSearchParams()
    if (searchParams.q) params.set("q", searchParams.q)
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, k === "inStock" ? "1" : String(v))
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <aside className="h-fit space-y-6 rounded-2xl border border-black/5 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{dict.filters.title}</h3>
        <button onClick={() => apply({ category: "", brand: "", animal: "", minPrice: "", maxPrice: "", inStock: false, sort: "" })} className="text-xs font-semibold text-brand hover:underline">
          {dict.filters.clearAll}
        </button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-foreground/60">{dict.filters.sortBy}</label>
        <select value={state.sort} onChange={(e) => apply({ sort: e.target.value })} className="w-full rounded-lg border border-black/10 p-2 text-sm">
          <option value="">—</option>
          <option value="price-asc">{dict.filters.sortPriceLowHigh}</option>
          <option value="price-desc">{dict.filters.sortPriceHighLow}</option>
          <option value="newest">{dict.filters.sortNewest}</option>
          <option value="best-selling">{dict.filters.sortBestSelling}</option>
          <option value="alphabetical">{dict.filters.sortAlphabetical}</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-foreground/60">{dict.nav.shop}</label>
        <select value={state.category} onChange={(e) => apply({ category: e.target.value })} className="w-full rounded-lg border border-black/10 p-2 text-sm">
          <option value="">—</option>
          {categories.map((c) => (
            <optgroup key={c.id} label={locale === "ar" ? c.nameAr : c.nameEn}>
              <option value={c.slug}>{locale === "ar" ? c.nameAr : c.nameEn} ({locale === "ar" ? "الكل" : "All"})</option>
              {c.children.map((s) => (
                <option key={s.id} value={s.slug}>
                  {locale === "ar" ? s.nameAr : s.nameEn}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-foreground/60">{dict.filters.brand}</label>
        <select value={state.brand} onChange={(e) => apply({ brand: e.target.value })} className="w-full rounded-lg border border-black/10 p-2 text-sm">
          <option value="">—</option>
          {brands.map((b) => (
            <option key={b.id} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-foreground/60">{dict.filters.animalType}</label>
        <select value={state.animal} onChange={(e) => apply({ animal: e.target.value })} className="w-full rounded-lg border border-black/10 p-2 text-sm">
          <option value="">—</option>
          {ANIMAL_TYPES.map((a) => (
            <option key={a} value={a}>{locale === "ar" ? ANIMAL_LABEL_AR[a] : ANIMAL_LABEL_EN[a]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-foreground/60">{dict.filters.priceRange} ({dict.common.sar})</label>
        <div className="flex gap-2">
          <input type="number" placeholder="0" value={state.minPrice} onChange={(e) => setState((s) => ({ ...s, minPrice: e.target.value }))} onBlur={() => apply({})} className="w-1/2 rounded-lg border border-black/10 p-2 text-sm" />
          <input type="number" placeholder="999" value={state.maxPrice} onChange={(e) => setState((s) => ({ ...s, maxPrice: e.target.value }))} onBlur={() => apply({})} className="w-1/2 rounded-lg border border-black/10 p-2 text-sm" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={state.inStock} onChange={(e) => apply({ inStock: e.target.checked })} />
        {dict.filters.inStockOnly}
      </label>
    </aside>
  )
}
