import { isValidLocale } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"
import LegalPage from "@/components/LegalPage"

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const ar = locale === "ar"

  return (
    <LegalPage title={ar ? "الشروط والأحكام" : "Terms & Conditions"}>
      {ar ? (
        <>
          <p>باستخدامك لموقع فايف باوز فإنك توافق على الشروط والأحكام التالية.</p>
          <h2>الطلبات والأسعار</h2>
          <p>جميع الأسعار المعروضة بالريال السعودي وتشمل ضريبة القيمة المضافة حيثما ينطبق ذلك. نحتفظ بحق تصحيح أي خطأ في السعر أو الوصف قبل تأكيد الشحن.</p>
          <h2>الدفع</h2>
          <p>الدفع الإلكتروني مطلوب لإتمام أي طلب؛ لا نوفر خيار الدفع عند الاستلام.</p>
          <h2>التوفر</h2>
          <p>قد تتغير كمية المخزون المتاحة؛ في حال نفاد منتج بعد الطلب سيتم التواصل معك لاسترجاع المبلغ أو استبداله.</p>
          <p className="text-xs text-foreground/50">[نص تجريبي قابل للمراجعة القانونية قبل الإطلاق الرسمي]</p>
        </>
      ) : (
        <>
          <p>By using the Five Paws website, you agree to the following terms.</p>
          <h2>Orders & Pricing</h2>
          <p>All prices are shown in Saudi Riyal (SAR) and include VAT where applicable. We reserve the right to correct any pricing or description error before shipment is confirmed.</p>
          <h2>Payment</h2>
          <p>Online payment is required to complete any order; Cash on Delivery is not offered.</p>
          <h2>Availability</h2>
          <p>Stock levels may change. If an item becomes unavailable after your order, we will contact you to offer a refund or replacement.</p>
          <p className="text-xs text-foreground/50">[Draft content — pending legal review before go-live.]</p>
        </>
      )}
    </LegalPage>
  )
}
