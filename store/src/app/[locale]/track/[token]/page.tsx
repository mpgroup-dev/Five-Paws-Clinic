import { isValidLocale, getDictionary } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>
}) {
  const { locale, token } = await params
  if (!isValidLocale(locale)) notFound()
  const dict = getDictionary(locale)

  const order = await prisma.order.findUnique({
    where: { trackingToken: token },
    include: { items: true, address: true },
  })
  if (!order) notFound()

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="mb-1 text-2xl font-bold text-brand-dark">{order.orderNumber}</h1>
      <p className="mb-6 text-sm text-foreground/60">
        {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB")}
      </p>

      <div className="mb-6 inline-flex rounded-full bg-brand-tint px-4 py-1.5 text-sm font-bold text-brand-dark">
        {dict.orderStatus[order.status]}
      </div>

      <div className="space-y-3 rounded-2xl border border-black/5 bg-white p-5">
        {order.items.map((it) => (
          <div key={it.id} className="flex justify-between text-sm">
            <span>{locale === "ar" ? it.nameArSnap : it.nameEnSnap} × {it.quantity}</span>
            <span>{(Number(it.priceSarSnap) * it.quantity).toFixed(2)} {dict.common.sar}</span>
          </div>
        ))}
        <div className="border-t border-black/10 pt-3 flex justify-between font-bold">
          <span>{dict.cart.total}</span>
          <span>{Number(order.totalSar).toFixed(2)} {dict.common.sar}</span>
        </div>
      </div>

      {order.address && (
        <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5 text-sm">
          <h2 className="mb-2 font-bold">{dict.checkout.deliveryAddress}</h2>
          <p>{order.address.fullName} — {order.address.mobile}</p>
          <p>{order.address.city}, {order.address.district}, {order.address.street}</p>
        </div>
      )}
    </div>
  )
}
