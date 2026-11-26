import Link from "next/link"
import { ShoppingCart, Heart, Search, Home } from "lucide-react"
import type { Locale } from "@/i18n/dictionaries"
import { getDictionary } from "@/i18n/getDictionary"
import { CLINIC_URL } from "@/lib/settings"
import LanguageSwitcher from "./LanguageSwitcher"

const CATEGORY_LINKS: { key: string; slug: string }[] = [
  { key: "cats", slug: "cats" },
  { key: "dogs", slug: "dogs" },
  { key: "birds", slug: "birds" },
  { key: "fishAquatic", slug: "fish-aquatic" },
  { key: "healthcare", slug: "healthcare-grooming" },
  { key: "toys", slug: "toys-accessories" },
  { key: "litter", slug: "cat-litter" },
]

export default function Navbar({ locale, cartCount = 0 }: { locale: Locale; cartCount?: number }) {
  const dict = getDictionary(locale)

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <a
          href={CLINIC_URL}
          className="hidden items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-brand hover:text-brand-dark sm:flex shrink-0"
        >
          <Home size={14} />
          {dict.nav.clinicHome}
        </a>
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold text-brand-dark">Five Paws</span>
        </Link>

        <form
          action={`/${locale}/products`}
          className="hidden md:flex flex-1 max-w-xl items-center gap-2 rounded-full border border-black/10 bg-brand-tint/60 px-4 py-2"
        >
          <Search size={17} className="text-brand" />
          <input
            name="q"
            placeholder={dict.nav.search}
            className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/50"
          />
        </form>

        <div className="ms-auto flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} label={dict.nav.account} />
          <Link
            href={`/${locale}/wishlist`}
            className="rounded-full p-2 hover:bg-brand-tint"
            aria-label={dict.nav.wishlist}
          >
            <Heart size={20} />
          </Link>
          <Link
            href={`/${locale}/cart`}
            className="relative rounded-full p-2 hover:bg-brand-tint"
            aria-label={dict.nav.cart}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="hidden md:block border-t border-black/5">
        <div className="container-page flex items-center gap-1 overflow-x-auto py-2 text-sm font-medium">
          {CATEGORY_LINKS.map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/products?category=${c.slug}`}
              className="whitespace-nowrap rounded-full px-3 py-1.5 hover:bg-brand-tint hover:text-brand-dark transition-colors"
            >
              {dict.nav[c.key as keyof typeof dict.nav]}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
