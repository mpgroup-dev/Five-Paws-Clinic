"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ORDER_STATUSES = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]
const PAYMENT_STATUSES = ["UNPAID", "PAID", "FAILED", "REFUNDED"]

export default function OrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: {
  orderId: string
  currentStatus: string
  currentPaymentStatus: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus }),
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-foreground/60">Order Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-black/10 p-2 text-sm">
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-foreground/60">Payment Status</span>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full rounded-lg border border-black/10 p-2 text-sm">
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <button onClick={save} disabled={saving} className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  )
}
