import { Geist, Geist_Mono, Cairo } from "next/font/google"
import { notFound } from "next/navigation"
import { locales } from "@/i18n/dictionaries"
import { getDictionary, isValidLocale } from "@/i18n/getDictionary"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getCurrentCart } from "@/lib/cart"
import "../globals.css"

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const cairo = Cairo({ variable: "--font-ar", subsets: ["arabic", "latin"] })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const cart = await getCurrentCart()
  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <html lang={locale} dir={dict.dir} className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar locale={locale} cartCount={cartCount} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  )
}
