"use client"

import { usePathname, useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import type { Locale } from "@/i18n/dictionaries"

export default function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const other: Locale = locale === "en" ? "ar" : "en"

  function switchTo() {
    const rest = pathname.replace(/^\/(en|ar)/, "")
    router.push(`/${other}${rest || ""}`)
  }

  return (
    <button
      onClick={switchTo}
      className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-white px-3 py-2 text-sm font-semibold text-brand-dark hover:border-brand hover:bg-brand-tint transition-colors"
      aria-label={label}
    >
      <Globe size={16} />
      <span>{other === "ar" ? "العربية" : "English"}</span>
    </button>
  )
}
