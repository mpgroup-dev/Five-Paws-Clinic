import { isValidLocale } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const ar = locale === "ar"

  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">{ar ? "تواصل معنا" : "Contact Us"}</h1>
      <div className="space-y-4">
        <Row icon={<Phone size={18} />} label={ar ? "الهاتف" : "Phone"} value="[رقم الهاتف] / [Phone number]" />
        <Row icon={<MessageCircle size={18} />} label="WhatsApp" value="[رقم واتساب] / [WhatsApp number]" />
        <Row icon={<Mail size={18} />} label={ar ? "البريد الإلكتروني" : "Email"} value="support@fivepaws.sa" />
        <Row icon={<MapPin size={18} />} label={ar ? "العنوان" : "Address"} value={ar ? "المملكة العربية السعودية" : "Saudi Arabia"} />
      </div>
      <p className="mt-8 text-sm text-foreground/50">
        {ar
          ? "[سيتم تحديث بيانات التواصل الفعلية بعد اعتمادها من العميل]"
          : "[Real contact details to be added once confirmed by the client]"}
      </p>
    </div>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4">
      <span className="text-brand">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-foreground/50">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}
