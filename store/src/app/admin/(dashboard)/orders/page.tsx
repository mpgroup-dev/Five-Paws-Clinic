import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: true },
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Orders</h1>
      <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-black/5 bg-brand-tint/40 text-start">
            <tr>
              {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map((h) => (
                <th key={h} className="p-3 text-start font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-black/5 last:border-0">
                <td className="p-3 font-semibold">{o.orderNumber}</td>
                <td className="p-3">{o.guestFullName}<br /><span className="text-xs text-foreground/50">{o.guestMobile}</span></td>
                <td className="p-3">{o.items.length}</td>
                <td className="p-3 font-semibold">{Number(o.totalSar).toFixed(2)} SAR</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${o.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="p-3">{o.status}</td>
                <td className="p-3 text-xs text-foreground/50">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-brand font-semibold hover:underline">View</Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-foreground/50">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
