"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export default function AdminLogoutButton() {
  const router = useRouter()
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }
  return (
    <button onClick={logout} className="mt-2 flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:underline">
      <LogOut size={15} /> Log out
    </button>
  )
}
