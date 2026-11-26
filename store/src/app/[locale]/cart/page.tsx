import Link from "next/link"
import Image from "next/image"
import { isValidLocale, getDictionary } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"
import { getCurrentCart, calculateTotals } from "@/lib/cart"
import { DEFAULT_SETTINGS } from "@/lib/settings"
import CartItemRow from "@/components/CartItemRow"
import CouponForm from "@/components/CouponForm"

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const dict = getDictionary(locale)

  const cart = await getCurrentCart()
  const items = cart.items.map((i) => ({
    id: i.id,
    quantity: i.quantity,
    priceSar: Number(i.variant.priceSar),
    size: i.variant.size,
    stock: i.variant.stock,
    name: locale === "ar" ? i.product.nameAr : i.product.nameEn,
    slug: i.product.slug,
    image: null as string | null,
  }))

  const { subtotal, tax, shipping, total } = calculateTotals(items, {
    shippingSar: items.length ? DEFAULT_SETTINGS.shipping.flatRateSar : 0,
    vatRatePercent: DEFAULT_SETTINGS.vatRatePercent,
  })
  const freeShippingLeft = Math.max(DEFAULT_SETTINGS.shipping.freeShippingThresholdSar - subtotal, 0)

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-xl font-bold">{dict.cart.empty}</h1>
        <Link href={`/${locale}/products`} className="mt-6 rounded-full bg-brand px-6 py-3 font-bold text-white">
          {dict.cart.continueShopping}
        </Link>
      </div>
    )
  }

  return (
    <div className="container-page grid gap-8 py-8 md:grid-cols-[1fr_340px]">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-brand-dark">{dict.cart.title}</h1>
        <div className="space-y-4">
          {items.map((i) => (
            <CartItemRow key={i.id} item={i} locale={locale as "en" | "ar"} dict={dict} />
          ))}
        </div>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-black/5 bg-white p-5">
        {freeShippingLeft > 0 && (
          <p className="rounded-lg bg-accent/10 p-2.5 text-xs font-semibold text-accent-dark">
            {dict.cart.freeShippingNotice.replace("{amount}", freeShippingLeft.toFixed(2))}
          </p>
        )}
        <CouponForm locale={locale as "en" | "ar"} dict={dict} />
        <dl className="space-y-2 text-sm">
          <Row label={dict.cart.subtotal} value={subtotal} dict={dict} />
          <Row label={dict.cart.shipping} value={shipping} dict={dict} />
          <Row label={dict.cart.tax} value={tax} dict={dict} />
          <div className="border-t border-black/10 pt-2">
            <Row label={dict.cart.total} value={total} dict={dict} bold />
          </div>
        </dl>
        <Link
          href={`/${locale}/checkout`}
          className="block w-full rounded-full bg-brand py-3.5 text-center font-bold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark"
        >
          {dict.cart.checkout}
        </Link>
      </aside>
    </div>
  )
}

function Row({ label, value, dict, bold }: { label: string; value: number; dict: ReturnType<typeof getDictionary>; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-bold" : ""}`}>
      <dt>{label}</dt>
      <dd>{value.toFixed(2)} {dict.common.sar}</dd>
    </div>
  )
}
