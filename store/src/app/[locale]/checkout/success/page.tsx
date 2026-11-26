import { isValidLocale, getDictionary } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, MessageCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const { token } = await searchParams
  if (!token) notFound()

  const order = await prisma.order.findUnique({
    where: { trackingToken: token },
    include: { items: true },
  })
  if (!order) notFound()

  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <CheckCircle2 size={56} className="text-emerald-500" />
      <h1 className="mt-4 text-2xl font-bold">
        {locale === "ar" ? "تم استلام طلبك!" : "Order Received!"}
      </h1>
      <p className="mt-2 max-w-md text-foreground/70">
        {locale === "ar"
          ? "شكرًا لك! رقم طلبك هو:"
          : "Thank you! Your order number is:"}
      </p>
      <div className="mt-4 rounded-xl bg-brand-dark px-6 py-3 text-xl font-bold text-white">{order.orderNumber}</div>

      <div className="mt-6 max-w-md rounded-xl bg-accent/10 p-4 text-sm text-accent-dark">
        {dict.checkout.paymentComingSoon}
      </div>

      <div className="mt-8 flex gap-3">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(order.orderNumber + " - " + (locale === "ar" ? "طلب جديد" : "New order"))}`}
          className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 font-bold text-white"
        >
          <MessageCircle size={18} /> WhatsApp
        </a>
        <Link href={`/${locale}`} className="rounded-full border border-black/10 px-5 py-2.5 font-bold">
          {locale === "ar" ? "العودة للرئيسية" : "Return Home"}
        </Link>
      </div>

      <p className="mt-6 text-xs text-foreground/50">
        {locale === "ar" ? "رابط تتبع الطلب: " : "Track your order at: "}
        <Link href={`/${locale}/track/${order.trackingToken}`} className="underline">/{locale}/track/{order.trackingToken}</Link>
      </p>
    </div>
  )
}
