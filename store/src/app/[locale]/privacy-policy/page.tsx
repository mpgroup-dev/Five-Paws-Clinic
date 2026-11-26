import { isValidLocale } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"
import LegalPage from "@/components/LegalPage"

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const ar = locale === "ar"

  return (
    <LegalPage title={ar ? "سياسة الخصوصية" : "Privacy Policy"}>
      {ar ? (
        <>
          <p>
            نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقًا لنظام حماية البيانات الشخصية
            في المملكة العربية السعودية.
          </p>
          <h2>المعلومات التي نجمعها</h2>
          <p>
            عند إتمام الطلب، نجمع: الاسم الكامل، رقم الجوال، البريد الإلكتروني (إن وُجد)،
            والعنوان (المدينة، الحي، الشارع). لا نطلب إنشاء حساب لإتمام الشراء.
          </p>
          <h2>كيف نستخدم بياناتك</h2>
          <p>
            تُستخدم بياناتك فقط لتجهيز طلبك وتوصيله والتواصل معك بخصوصه، ولن تُباع أو
            تُشارك مع أي طرف ثالث لأغراض تسويقية دون موافقتك.
          </p>
          <h2>أمان الدفع</h2>
          <p>
            لا نقوم بتخزين بيانات بطاقتك البنكية على خوادمنا؛ تتم معالجة الدفع عبر بوابة
            دفع معتمدة ومشفّرة.
          </p>
          <h2>حقوقك</h2>
          <p>يمكنك طلب الاطلاع على بياناتك أو تعديلها أو حذفها بالتواصل معنا عبر صفحة التواصل.</p>
          <p className="text-xs text-foreground/50">
            [نص تجريبي قابل للمراجعة القانونية قبل الإطلاق الرسمي]
          </p>
        </>
      ) : (
        <>
          <p>
            We respect your privacy and are committed to protecting your personal data in
            line with Saudi Arabia&apos;s Personal Data Protection Law (PDPL).
          </p>
          <h2>Information We Collect</h2>
          <p>
            At checkout we collect: full name, mobile number, email (if provided), and
            delivery address (city, district, street). No account is required to purchase.
          </p>
          <h2>How We Use Your Data</h2>
          <p>
            Your data is used solely to process and deliver your order and to contact you
            about it. We never sell your data or share it with third parties for marketing
            without your consent.
          </p>
          <h2>Payment Security</h2>
          <p>We never store your card details on our servers; payments are processed through an encrypted, certified payment gateway.</p>
          <h2>Your Rights</h2>
          <p>You may request to view, correct, or delete your data at any time via our Contact page.</p>
          <p className="text-xs text-foreground/50">[Draft content — pending legal review before go-live.]</p>
        </>
      )}
    </LegalPage>
  )
}
