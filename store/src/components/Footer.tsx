import Link from "next/link"
import { Facebook, Instagram, MessageCircle } from "lucide-react"
import type { Locale } from "@/i18n/dictionaries"
import { getDictionary } from "@/i18n/getDictionary"

export default function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const year = new Date().getFullYear()

  const links = [
    { key: "about", href: "about" },
    { key: "contact", href: "contact" },
    { key: "privacyPolicy", href: "privacy-policy" },
    { key: "terms", href: "terms" },
    { key: "shippingPolicy", href: "shipping-policy" },
    { key: "returnsPolicy", href: "returns-policy" },
    { key: "faq", href: "faq" },
  ] as const

  return (
    <footer className="mt-16 border-t border-black/5 bg-brand-tint/40">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <span className="text-lg font-bold text-brand-dark">Five Paws</span>
          <p className="mt-3 max-w-xs text-sm text-foreground/70">
            {locale === "ar"
              ? "كل ما يحتاجه حيوانك الأليف من أغذية وعناية وإكسسوارات، بتوصيل لجميع مناطق المملكة."
              : "Everything your pet needs — food, care and accessories, delivered across Saudi Arabia."}
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Facebook" className="rounded-full bg-white p-2 shadow-sm">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="rounded-full bg-white p-2 shadow-sm">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="WhatsApp" className="rounded-full bg-white p-2 shadow-sm">
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">{locale === "ar" ? "روابط مهمة" : "Quick Links"}</h4>
          <ul className="space-y-2 text-sm text-foreground/70">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={`/${locale}/${l.href}`} className="hover:text-brand-dark">
                  {dict.footer[l.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5 py-4 text-center text-xs text-foreground/60">
        © {year} Five Paws. {dict.footer.rights}
      </div>
    </footer>
  )
}
