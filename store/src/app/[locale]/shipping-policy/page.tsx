import { isValidLocale } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"
import LegalPage from "@/components/LegalPage"
import { DEFAULT_SETTINGS } from "@/lib/settings"

export default async function ShippingPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const ar = locale === "ar"
  const s = DEFAULT_SETTINGS.shipping

  return (
    <LegalPage title={ar ? "سياسة الشحن" : "Shipping Policy"}>
      {ar ? (
        <>
          <p>نوفر التوصيل إلى {s.coverageAr}.</p>
          <h2>رسوم الشحن</h2>
          <p>رسوم شحن ثابتة قدرها {s.flatRateSar} ريال سعودي لكل طلب. شحن مجاني للطلبات بقيمة {s.freeShippingThresholdSar} ريال سعودي أو أكثر.</p>
          <h2>مدة التوصيل</h2>
          <p>المدة المتوقعة للتوصيل من {s.estimatedDeliveryDays} أيام عمل من تاريخ تأكيد الطلب، وقد تختلف حسب المنطقة.</p>
          <p className="text-xs text-foreground/50">[رسوم ومدد الشحن أولية وقابلة للتعديل من لوحة التحكم بعد اعتماد شركة الشحن الفعلية]</p>
        </>
      ) : (
        <>
          <p>We currently deliver to {s.coverage}.</p>
          <h2>Shipping Fees</h2>
          <p>A flat shipping fee of {s.flatRateSar} SAR applies per order. Orders of {s.freeShippingThresholdSar} SAR or more ship free.</p>
          <h2>Delivery Time</h2>
          <p>Estimated delivery is {s.estimatedDeliveryDays} business days from order confirmation, and may vary by region.</p>
          <p className="text-xs text-foreground/50">[These are initial, admin-editable defaults pending the actual courier agreement.]</p>
        </>
      )}
    </LegalPage>
  )
}
