"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    })
    if (res.ok) {
      router.push("/admin")
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Invalid email or password")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-tint">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-xl font-bold text-brand-dark">Five Paws Admin</h1>
        <p className="mb-6 text-sm text-foreground/60">Sign in to manage the store</p>
        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">Email</span>
          <input name="email" type="email" required className="w-full rounded-lg border border-black/10 p-2.5 text-sm" />
        </label>
        <label className="mb-5 block">
          <span className="mb-1 block text-xs font-semibold text-foreground/60">Password</span>
          <input name="password" type="password" required className="w-full rounded-lg border border-black/10 p-2.5 text-sm" />
        </label>
        {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-brand py-3 font-bold text-white disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  )
}
