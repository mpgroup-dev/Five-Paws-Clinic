import { prisma } from "@/lib/prisma"
import CouponCreateForm from "@/components/admin/CouponCreateForm"

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Coupons</h1>
      <CouponCreateForm />

      <div className="mt-8 overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-black/5 bg-brand-tint/40">
            <tr>
              {["Code", "Discount", "Min Order", "Expires", "Used", "Active"].map((h) => (
                <th key={h} className="p-3 text-start font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-black/5 last:border-0">
                <td className="p-3 font-mono font-bold">{c.code}</td>
                <td className="p-3">{c.percentOff ? `${c.percentOff}%` : c.amountOffSar ? `${c.amountOffSar} SAR` : "—"}</td>
                <td className="p-3">{c.minOrderSar ? `${c.minOrderSar} SAR` : "—"}</td>
                <td className="p-3">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</td>
                <td className="p-3">{c.timesUsed}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                <td className="p-3">{c.isActive ? "✅" : "—"}</td>
              </tr>
            ))}
            {coupons.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-foreground/50">No coupons yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
