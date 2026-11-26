import { isValidLocale, getDictionary } from "@/i18n/getDictionary"
import { notFound, redirect } from "next/navigation"
import { getCurrentCart, calculateTotals } from "@/lib/cart"
import { DEFAULT_SETTINGS } from "@/lib/settings"
import CheckoutForm from "@/components/CheckoutForm"

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const dict = getDictionary(locale)

  const cart = await getCurrentCart()
  if (cart.items.length === 0) redirect(`/${locale}/cart`)

  const items = cart.items.map((i) => ({
    priceSar: Number(i.variant.priceSar),
    quantity: i.quantity,
  }))
  const totals = calculateTotals(items, {
    shippingSar: DEFAULT_SETTINGS.shipping.flatRateSar,
    vatRatePercent: DEFAULT_SETTINGS.vatRatePercent,
  })

  return (
    <div className="container-page grid gap-8 py-8 md:grid-cols-[1fr_340px]">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-brand-dark">{dict.checkout.title}</h1>
        <p className="mb-6 rounded-lg bg-brand-tint/60 p-3 text-sm font-medium text-brand-dark">
          {dict.checkout.guestNotice}
        </p>
        <CheckoutForm locale={locale as "en" | "ar"} dict={dict} />
      </div>

      <aside className="h-fit space-y-3 rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="font-bold">{dict.checkout.orderSummary}</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt>{dict.cart.subtotal}</dt><dd>{totals.subtotal.toFixed(2)} {dict.common.sar}</dd></div>
          <div className="flex justify-between"><dt>{dict.cart.shipping}</dt><dd>{totals.shipping.toFixed(2)} {dict.common.sar}</dd></div>
          <div className="flex justify-between"><dt>{dict.cart.tax}</dt><dd>{totals.tax.toFixed(2)} {dict.common.sar}</dd></div>
          <div className="flex justify-between border-t border-black/10 pt-2 text-base font-bold">
            <dt>{dict.cart.total}</dt><dd>{totals.total.toFixed(2)} {dict.common.sar}</dd>
          </div>
        </dl>
      </aside>
    </div>
  )
}
