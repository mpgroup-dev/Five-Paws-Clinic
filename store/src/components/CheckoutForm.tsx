"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Locale } from "@/i18n/dictionaries"
import { getDictionary } from "@/i18n/getDictionary"

type Errors = Record<string, string>

export default function CheckoutForm({ locale, dict }: { locale: Locale; dict: ReturnType<typeof getDictionary> }) {
  const router = useRouter()
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (!res.ok) {
      setErrors(data.fieldErrors ?? { _: data.error ?? dict.common.error })
      setLoading(false)
      return
    }

    router.refresh()
    router.push(`/${locale}/checkout/success?token=${data.trackingToken}`)
  }

  const Field = ({ name, label, type = "text", required = true }: { name: string; label: string; type?: string; required?: boolean }) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground/60">{label}{required && " *"}</span>
      <input name={name} type={type} required={required} className="w-full rounded-lg border border-black/10 p-2.5 text-sm" />
      {errors[name] && <span className="mt-1 block text-xs font-medium text-red-600">{errors[name]}</span>}
    </label>
  )

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="mb-2 font-bold">{dict.checkout.contactInfo}</legend>
        <Field name="fullName" label={dict.checkout.fullName} />
        <div className="grid grid-cols-2 gap-3">
          <Field name="mobile" label={dict.checkout.mobile} type="tel" />
          <Field name="email" label={dict.checkout.emailOptional} type="email" required={false} />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-2 font-bold">{dict.checkout.deliveryAddress}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Field name="city" label={dict.checkout.city} />
          <Field name="district" label={dict.checkout.district} />
        </div>
        <Field name="street" label={dict.checkout.street} />
        <Field name="buildingNo" label={dict.checkout.buildingNo} required={false} />
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">{dict.checkout.notes}</span>
          <textarea name="notes" rows={3} className="w-full rounded-lg border border-black/10 p-2.5 text-sm" />
        </label>
      </fieldset>

      {errors._ && <p className="text-sm font-medium text-red-600">{errors._}</p>}

      <button
        disabled={loading}
        className="w-full rounded-full bg-brand py-3.5 font-bold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark disabled:opacity-50"
      >
        {loading ? dict.common.loading : dict.checkout.placeOrder}
      </button>
    </form>
  )
}
