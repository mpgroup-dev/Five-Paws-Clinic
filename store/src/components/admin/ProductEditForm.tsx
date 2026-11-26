"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type Variant = { id: string; size: string | null; priceSar: number; stock: number; sku: string }
type Category = { id: string; nameEn: string; children: { id: string; nameEn: string }[] }
type Brand = { id: string; name: string }

export default function ProductEditForm({
  product,
  categories,
  brands,
}: {
  product: {
    id: string
    nameEn: string
    nameAr: string
    descriptionEn: string | null
    descriptionAr: string | null
    categoryId: string | null
    brandId: string | null
    animalType: string
    status: string
    variants: Variant[]
    images: { id: string; url: string }[]
  }
  categories: Category[]
  brands: Brand[]
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    nameEn: product.nameEn,
    nameAr: product.nameAr,
    descriptionEn: product.descriptionEn ?? "",
    descriptionAr: product.descriptionAr ?? "",
    categoryId: product.categoryId ?? "",
    brandId: product.brandId ?? "",
    animalType: product.animalType,
    status: product.status,
  })
  const [variants, setVariants] = useState(product.variants)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState(product.images)

  async function save() {
    setSaving(true)
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, variants }),
    })
    setSaving(false)
    router.refresh()
  }

  async function uploadImage(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("productId", product.id)
    const res = await fetch("/api/admin/products/upload-image", { method: "POST", body: fd })
    if (res.ok) {
      const img = await res.json()
      setImages((imgs) => [...imgs, img])
    }
    setUploading(false)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold">Images</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative h-20 w-20 overflow-hidden rounded-lg bg-brand-tint/50">
              <Image src={img.url} alt="" fill className="object-contain" />
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-black/15 text-xs text-foreground/50">
            {uploading ? "..." : "+ Add"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-black/5 bg-white p-5">
        <Field label="Name (English)" value={form.nameEn} onChange={(v) => setForm((f) => ({ ...f, nameEn: v }))} />
        <Field label="Name (Arabic)" value={form.nameAr} onChange={(v) => setForm((f) => ({ ...f, nameAr: v }))} dir="rtl" />
        <div className="col-span-2">
          <TextArea label="Description (English)" value={form.descriptionEn} onChange={(v) => setForm((f) => ({ ...f, descriptionEn: v }))} />
        </div>
        <div className="col-span-2">
          <TextArea label="Description (Arabic)" value={form.descriptionAr} onChange={(v) => setForm((f) => ({ ...f, descriptionAr: v }))} dir="rtl" />
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">Category</span>
          <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} className="w-full rounded-lg border border-black/10 p-2 text-sm">
            <option value="">—</option>
            {categories.map((c) => (
              <optgroup key={c.id} label={c.nameEn}>
                {c.children.map((s) => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
              </optgroup>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">Brand</span>
          <select value={form.brandId} onChange={(e) => setForm((f) => ({ ...f, brandId: e.target.value }))} className="w-full rounded-lg border border-black/10 p-2 text-sm">
            <option value="">—</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">Animal Type</span>
          <select value={form.animalType} onChange={(e) => setForm((f) => ({ ...f, animalType: e.target.value }))} className="w-full rounded-lg border border-black/10 p-2 text-sm">
            {["CAT", "DOG", "CAT_AND_DOG", "BIRD", "FISH", "TURTLE", "SMALL_PET", "OTHER", "UNSPECIFIED"].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">Status</span>
          <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full rounded-lg border border-black/10 p-2 text-sm">
            {["ACTIVE", "DRAFT", "OUT_OF_STOCK", "ARCHIVED"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <div className="rounded-xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold">Variants (Size / Price / Stock)</h2>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={v.id} className="grid grid-cols-4 gap-2">
              <input value={v.size ?? ""} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, size: e.target.value } : x))} placeholder="Size" className="rounded-lg border border-black/10 p-2 text-sm" />
              <input type="number" step="0.01" value={v.priceSar} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, priceSar: Number(e.target.value) } : x))} placeholder="Price SAR" className="rounded-lg border border-black/10 p-2 text-sm" />
              <input type="number" value={v.stock} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, stock: Number(e.target.value) } : x))} placeholder="Stock" className="rounded-lg border border-black/10 p-2 text-sm" />
              <span className="flex items-center text-xs text-foreground/50">{v.sku}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving} className="rounded-full bg-brand px-6 py-3 font-bold text-white disabled:opacity-50">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  )
}

function Field({ label, value, onChange, dir }: { label: string; value: string; onChange: (v: string) => void; dir?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground/60">{label}</span>
      <input value={value} dir={dir} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-black/10 p-2 text-sm" />
    </label>
  )
}
function TextArea({ label, value, onChange, dir }: { label: string; value: string; onChange: (v: string) => void; dir?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground/60">{label}</span>
      <textarea value={value} dir={dir} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full rounded-lg border border-black/10 p-2 text-sm" />
    </label>
  )
}
