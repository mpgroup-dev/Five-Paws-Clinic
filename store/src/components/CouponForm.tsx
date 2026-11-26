"use client"

import { useState } from "react"
import type { Locale } from "@/i18n/dictionaries"
import { getDictionary } from "@/i18n/getDictionary"

export default function CouponForm({ locale, dict }: { locale: Locale; dict: ReturnType<typeof getDictionary> }) {
  const [code, setCode] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  async function apply(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/coupon/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    const data = await res.json()
    setMessage(res.ok ? dict.cart.couponApplied : dict.cart.couponInvalid)
  }

  return (
    <form onSubmit={apply} className="flex gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={dict.cart.couponPlaceholder}
        className="flex-1 rounded-full border border-black/10 px-3 py-2 text-sm"
      />
      <button className="rounded-full bg-brand-tint px-4 py-2 text-sm font-bold text-brand-dark">
        {dict.cart.applyCoupon}
      </button>
      {message && <p className="w-full text-xs text-foreground/60">{message}</p>}
    </form>
  )
}
