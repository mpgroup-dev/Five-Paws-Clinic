import { isValidLocale } from "@/i18n/getDictionary"
import { notFound } from "next/navigation"

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const ar = locale === "ar"

  return (
    <div className="container-page max-w-3xl py-12 prose prose-neutral">
      <h1 className="text-brand-dark">{ar ? "من نحن" : "About Us"}</h1>
      {ar ? (
        <>
          <p>
            فايف باوز هو متجر إلكتروني متخصص في بيع الأغذية ومستلزمات العناية والإكسسوارات
            للحيوانات الأليفة — القطط والكلاب والطيور والأسماك وغيرها — موجّه لعملائنا في
            جميع أنحاء المملكة العربية السعودية.
          </p>
          <p>
            هدفنا تسهيل وصولك لمنتجات أصلية وموثوقة لحيوانك الأليف، بأسعار واضحة وتوصيل
            سريع، من دون الحاجة لإنشاء حساب أو تعقيدات في عملية الشراء.
          </p>
          <p className="text-sm text-foreground/50">
            [سيتم تحديث هذا القسم بمعلومات الشركة الرسمية المعتمدة عند توفرها]
          </p>
        </>
      ) : (
        <>
          <p>
            Five Paws is an online store for pet food, care products and accessories — for
            cats, dogs, birds, fish and more — serving customers across the Kingdom of Saudi
            Arabia.
          </p>
          <p>
            Our goal is simple: make it easy to find genuine, reliable products for your pet,
            with clear pricing and fast delivery — no account required.
          </p>
          <p className="text-sm text-foreground/50">
            [This section will be updated with the client&apos;s approved company details.]
          </p>
        </>
      )}
    </div>
  )
}
