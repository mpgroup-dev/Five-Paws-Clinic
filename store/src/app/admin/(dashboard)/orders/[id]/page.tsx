import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import OrderStatusForm from "@/components/admin/OrderStatusForm"

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, address: true },
  })
  if (!order) notFound()

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-brand-dark">{order.orderNumber}</h1>
      <p className="mb-6 text-sm text-foreground/50">{new Date(order.createdAt).toLocaleString()}</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-black/5 bg-white p-5">
          <h2 className="mb-3 font-bold">Customer</h2>
          <p>{order.guestFullName}</p>
          <p className="text-sm text-foreground/60">{order.guestMobile} · {order.guestEmail ?? "—"}</p>
          {order.address && (
            <p className="mt-2 text-sm text-foreground/60">
              {order.address.city}, {order.address.district}, {order.address.street}
              {order.address.buildingNo ? `, Bldg ${order.address.buildingNo}` : ""}
            </p>
          )}
          {order.notes && <p className="mt-2 text-sm italic text-foreground/50">Note: {order.notes}</p>}
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-5">
          <h2 className="mb-3 font-bold">Status</h2>
          <OrderStatusForm orderId={order.id} currentStatus={order.status} currentPaymentStatus={order.paymentStatus} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold">Items</h2>
        <table className="w-full text-sm">
          <tbody>
            {order.items.map((it) => (
              <tr key={it.id} className="border-b border-black/5 last:border-0">
                <td className="py-2">{it.nameEnSnap} {it.sizeSnap ? `(${it.sizeSnap})` : ""}</td>
                <td className="py-2 text-center">× {it.quantity}</td>
                <td className="py-2 text-end font-semibold">{(Number(it.priceSarSnap) * it.quantity).toFixed(2)} SAR</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 space-y-1 border-t border-black/10 pt-3 text-sm">
          <Row label="Subtotal" value={order.subtotalSar} />
          <Row label="Shipping" value={order.shippingSar} />
          <Row label="Tax" value={order.taxSar} />
          <Row label="Discount" value={order.discountSar} negative />
          <Row label="Total" value={order.totalSar} bold />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, bold, negative }: { label: string; value: unknown; bold?: boolean; negative?: boolean }) {
  const n = Number(value)
  return (
    <div className={`flex justify-between ${bold ? "text-base font-bold" : ""}`}>
      <span>{label}</span>
      <span>{negative && n > 0 ? "-" : ""}{n.toFixed(2)} SAR</span>
    </div>
  )
}
