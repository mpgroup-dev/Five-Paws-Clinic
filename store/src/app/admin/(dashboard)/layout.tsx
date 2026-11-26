import { redirect } from "next/navigation"
import Link from "next/link"
import { getAdminSession } from "@/lib/adminAuth"
import AdminLogoutButton from "@/components/admin/AdminLogoutButton"
import { LayoutDashboard, Package, FolderTree, ShoppingBag, Tag, Settings } from "lucide-react"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-60 shrink-0 border-e border-black/5 bg-white p-4">
        <div className="mb-6 px-2 text-lg font-bold text-brand-dark">Five Paws Admin</div>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-brand-tint hover:text-brand-dark"
            >
              <item.icon size={17} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-black/5 pt-4">
          <p className="px-3 text-xs text-foreground/50">{session.email}</p>
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
