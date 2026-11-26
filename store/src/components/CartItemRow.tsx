"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import type { Locale } from "@/i18n/dictionaries"
import { getDictionary } from "@/i18n/getDictionary"

type Item = { id: string; quantity: number; priceSar: number; size: string | null; name: string; slug: string }

export default function CartItemRow({ item, locale, dict }: { item: Item; locale: Locale; dict: ReturnType<typeof getDictionary> }) {
  const router = useRouter()

  async function updateQty(quantity: number) {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, quantity }),
    })
    router.refresh()
  }

  async function remove() {
    await fetch(`/api/cart?itemId=${item.id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-tint/50 text-2xl">🐾</div>
      <div className="min-w-0 flex-1">
        <Link href={`/${locale}/products/${item.slug}`} className="line-clamp-1 font-semibold hover:text-brand-dark">
          {item.name}
        </Link>
        {item.size && <p className="text-xs text-foreground/50">{item.size}</p>}
        <p className="mt-1 font-bold text-brand-dark">{item.priceSar.toFixed(2)} {dict.common.sar}</p>
      </div>
      <div className="flex items-center rounded-full border border-black/10">
        <button onClick={() => updateQty(Math.max(1, item.quantity - 1))} className="p-2"><Minus size={14} /></button>
        <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
        <button onClick={() => updateQty(item.quantity + 1)} className="p-2"><Plus size={14} /></button>
      </div>
      <button onClick={remove} aria-label={dict.cart.remove} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
        <Trash2 size={18} />
      </button>
    </div>
  )
}
