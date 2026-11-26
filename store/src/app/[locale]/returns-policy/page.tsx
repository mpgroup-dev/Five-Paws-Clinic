import { isValidLocale } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"
import LegalPage from "@/components/LegalPage"

export default async function ReturnsPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const ar = locale === "ar"

  return (
    <LegalPage title={ar ? "سياسة الإرجاع والاسترجاع" : "Returns & Refunds Policy"}>
      {ar ? (
        <>
          <p>نسعى لرضاك التام عن مشترياتك. إذا وصل المنتج تالفًا أو غير مطابق للطلب، يمكنك طلب الإرجاع أو الاستبدال خلال 7 أيام من استلام الطلب.</p>
          <h2>شروط الإرجاع</h2>
          <p>يجب أن يكون المنتج غير مستخدم وفي عبوته الأصلية. لأسباب صحية، قد لا تُقبل إرجاع بعض المنتجات المفتوحة (مثل الأطعمة المعلبة المفتوحة).</p>
          <h2>استرجاع المبلغ</h2>
          <p>بعد الموافقة على الإرجاع، يتم استرجاع المبلغ إلى وسيلة الدفع نفسها المستخدمة في الطلب خلال مدة معقولة.</p>
          <p className="text-xs text-foreground/50">[نص تجريبي قابل للمراجعة القانونية قبل الإطلاق الرسمي]</p>
        </>
      ) : (
        <>
          <p>Your satisfaction matters. If an item arrives damaged or not as ordered, you may request a return or exchange within 7 days of delivery.</p>
          <h2>Return Conditions</h2>
          <p>Items must be unused and in their original packaging. For hygiene reasons, some opened products (e.g. opened canned food) may not be eligible for return.</p>
          <h2>Refunds</h2>
          <p>Once a return is approved, the refund is issued to the original payment method within a reasonable timeframe.</p>
          <p className="text-xs text-foreground/50">[Draft content — pending legal review before go-live.]</p>
        </>
      )}
    </LegalPage>
  )
}
