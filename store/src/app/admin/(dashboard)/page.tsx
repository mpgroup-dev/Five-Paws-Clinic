import { prisma } from "@/lib/prisma"
import { DollarSign, ShoppingBag, Clock, AlertTriangle } from "lucide-react"

export default async function AdminDashboardPage() {
  const [totalOrders, pendingOrders, paidOrders, lowStock, bestSellers] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { totalSar: true } }),
    prisma.productVariant.count({ where: { stock: { lte: 5, gt: 0 } } }),
    prisma.product.findMany({ where: { isBestSeller: true }, take: 5 }),
  ])

  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalSar), 0)
  const draftProducts = await prisma.product.count({ where: { status: "DRAFT" } })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<DollarSign size={20} />} label="Total Revenue (Paid)" value={`${totalRevenue.toFixed(2)} SAR`} />
        <Stat icon={<ShoppingBag size={20} />} label="Total Orders" value={totalOrders} />
        <Stat icon={<Clock size={20} />} label="Pending Payment" value={pendingOrders} />
        <Stat icon={<AlertTriangle size={20} />} label="Low Stock Variants" value={lowStock} warn />
      </div>

      {draftProducts > 0 && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>{draftProducts} products</strong> are currently in <strong>Draft</strong> status (missing image,
          price, category or species confirmation) and are not visible on the storefront. Review them under{" "}
          <a href="/admin/products?status=DRAFT" className="underline">Products</a>.
        </div>
      )}
    </div>
  )
}

function Stat({ icon, label, value, warn }: { icon: React.ReactNode; label: string; value: string | number; warn?: boolean }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <span className={warn ? "text-amber-500" : "text-brand"}>{icon}</span>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-xs text-foreground/50">{label}</p>
    </div>
  )
}
