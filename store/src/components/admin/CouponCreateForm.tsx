"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CouponCreateForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    })
    setSaving(false)
    e.currentTarget.reset()
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3 rounded-xl border border-black/5 bg-white p-5 sm:grid-cols-5">
      <input name="code" required placeholder="CODE" className="rounded-lg border border-black/10 p-2 text-sm uppercase" />
      <input name="percentOff" type="number" placeholder="% off" className="rounded-lg border border-black/10 p-2 text-sm" />
      <input name="amountOffSar" type="number" step="0.01" placeholder="SAR off" className="rounded-lg border border-black/10 p-2 text-sm" />
      <input name="minOrderSar" type="number" step="0.01" placeholder="Min order SAR" className="rounded-lg border border-black/10 p-2 text-sm" />
      <input name="expiresAt" type="date" className="rounded-lg border border-black/10 p-2 text-sm" />
      <button disabled={saving} className="col-span-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white sm:col-span-1">
        {saving ? "..." : "Create"}
      </button>
    </form>
  )
}
