"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    })
    if (res.ok) {
      const { id } = await res.json()
      router.push(`/admin/products/${id}`)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Failed to create product")
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Add Product</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-black/5 bg-white p-5">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">Name (English) *</span>
          <input name="nameEn" required className="w-full rounded-lg border border-black/10 p-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">Name (Arabic) *</span>
          <input name="nameAr" required dir="rtl" className="w-full rounded-lg border border-black/10 p-2 text-sm" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-foreground/60">Price (SAR) *</span>
            <input name="priceSar" type="number" step="0.01" required className="w-full rounded-lg border border-black/10 p-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-foreground/60">Stock *</span>
            <input name="stock" type="number" required defaultValue={0} className="w-full rounded-lg border border-black/10 p-2 text-sm" />
          </label>
        </div>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button disabled={saving} className="w-full rounded-full bg-brand py-3 font-bold text-white disabled:opacity-50">
          {saving ? "Creating..." : "Create Product (as Draft)"}
        </button>
        <p className="text-xs text-foreground/50">
          New products start as Draft. Add an image, category and brand on the edit page, then switch status to Active.
        </p>
      </form>
    </div>
  )
}
