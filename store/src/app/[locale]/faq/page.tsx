import { isValidLocale } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"

const FAQ_EN = [
  { q: "Do I need an account to order?", a: "No — you can check out as a guest using just your name, mobile number and delivery address." },
  { q: "What payment methods do you accept?", a: "We accept secure online payment only (Mada, Visa, Mastercard, Apple Pay where supported). Cash on Delivery is not available." },
  { q: "Which areas do you deliver to?", a: "We currently deliver across Saudi Arabia." },
  { q: "How can I track my order?", a: "After checkout you'll get a tracking link and order number — no login required." },
  { q: "Can I return a product?", a: "Yes, see our Returns & Refunds Policy for eligibility and process." },
]
const FAQ_AR = [
  { q: "هل أحتاج لإنشاء حساب لأطلب؟", a: "لا — يمكنك إتمام الشراء كضيف بإدخال اسمك ورقم جوالك وعنوان التوصيل فقط." },
  { q: "ما طرق الدفع المتاحة؟", a: "نقبل الدفع الإلكتروني الآمن فقط (مدى، فيزا، ماستركارد، Apple Pay حيثما تتوفر). لا يتوفر الدفع عند الاستلام." },
  { q: "ما المناطق التي توصلون لها؟", a: "نوفر التوصيل حاليًا لجميع مناطق المملكة العربية السعودية." },
  { q: "كيف أتتبع طلبي؟", a: "بعد إتمام الطلب ستحصل على رابط تتبع ورقم طلب — بدون الحاجة لتسجيل الدخول." },
  { q: "هل يمكنني إرجاع منتج؟", a: "نعم، راجع سياسة الإرجاع والاسترجاع لمعرفة الشروط والخطوات." },
]

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const ar = locale === "ar"
  const list = ar ? FAQ_AR : FAQ_EN

  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">{ar ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</h1>
      <div className="space-y-4">
        {list.map((item, i) => (
          <details key={i} className="group rounded-xl border border-black/5 bg-white p-4">
            <summary className="cursor-pointer list-none font-semibold">{item.q}</summary>
            <p className="mt-2 text-sm text-foreground/70">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
