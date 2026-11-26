"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import type { Locale } from "@/i18n/dictionaries"
import { getDictionary } from "@/i18n/getDictionary"

type Variant = { id: string; size: string | null; priceSar: number; stock: number }

export default function AddToCartForm({
  productId,
  variants,
  locale,
  dict,
}: {
  productId: string
  variants: Variant[]
  locale: Locale
  dict: ReturnType<typeof getDictionary>
}) {
  const router = useRouter()
  const [variantId, setVariantId] = useState(variants[0]?.id)
  const [qty, setQty] = useState(1)
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const variant = variants.find((v) => v.id === variantId) ?? variants[0]
  const inStock = (variant?.stock ?? 0) > 0

  async function addToCart() {
    setStatus("loading")
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, variantId, quantity: qty }),
    })
    if (res.ok) {
      setStatus("done")
      router.refresh()
      setTimeout(() => setStatus("idle"), 1800)
    } else {
      setStatus("idle")
    }
  }

  return (
    <div className="mt-5">
      <div className="text-3xl font-extrabold text-brand-dark">
        {variant ? `${variant.priceSar.toFixed(2)} ${dict.common.sar}` : "—"}
      </div>

      {variants.length > 1 && variants.some((v) => v.size) && (
        <div className="mt-4">
          <label className="mb-1 block text-xs font-semibold text-foreground/60">{dict.product.selectSize}</label>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                disabled={v.stock === 0}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  v.id === variantId ? "border-brand bg-brand text-white" : "border-black/10 hover:border-brand"
                }`}
              >
                {v.size ?? "—"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        <span className="text-xs font-semibold text-foreground/60">{dict.product.quantity}</span>
        <div className="flex items-center rounded-full border border-black/10">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2" aria-label="-">
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-bold">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="p-2" aria-label="+">
            <Plus size={14} />
          </button>
        </div>
      </div>

      <button
        onClick={addToCart}
        disabled={!inStock || status === "loading"}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-bold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShoppingCart size={18} />
        {!inStock ? dict.product.outOfStock : status === "done" ? dict.product.addedToCart : dict.product.addToCart}
      </button>
    </div>
  )
}
