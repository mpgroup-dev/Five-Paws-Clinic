import { DEFAULT_SETTINGS } from "@/lib/settings"

export default function AdminSettingsPage() {
  const s = DEFAULT_SETTINGS

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Settings</h1>

      <section className="rounded-xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold">Shipping</h2>
        <dl className="space-y-2 text-sm">
          <Row label="Coverage" value={s.shipping.coverage} />
          <Row label="Flat rate" value={`${s.shipping.flatRateSar} SAR`} />
          <Row label="Free shipping over" value={`${s.shipping.freeShippingThresholdSar} SAR`} />
          <Row label="Estimated delivery" value={`${s.shipping.estimatedDeliveryDays} business days`} />
        </dl>
        <p className="mt-3 text-xs text-foreground/50">
          These are placeholder defaults set while the real courier agreement is finalized.
          Update via the StoreSetting table once confirmed.
        </p>
      </section>

      <section className="rounded-xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold">Payment Gateway</h2>
        <p className="text-sm text-foreground/70">
          Status: <span className="font-bold text-amber-600">Not configured</span>
        </p>
        <p className="mt-1 text-xs text-foreground/50">
          Online payment (Mada / Visa / Mastercard / Apple Pay) will be enabled once a provider
          (Tap, PayTabs, HyperPay, or Moyasar) is selected and API keys are added to the
          environment variables. Cash on Delivery is intentionally not offered.
        </p>
      </section>

      <section className="rounded-xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold">Notifications</h2>
        <div className="space-y-2 text-sm">
          <Toggle label="Email notifications" enabled={s.notifications.emailEnabled} />
          <Toggle label="WhatsApp notifications" enabled={s.notifications.whatsappEnabled} />
          <Toggle label="SMS notifications" enabled={s.notifications.smsEnabled} />
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          Channels are stubbed and ready to wire up once a provider is chosen (e.g. for email,
          WhatsApp Business API, or an SMS gateway).
        </p>
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-foreground/60">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}
function Toggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${enabled ? "bg-emerald-100 text-emerald-700" : "bg-black/5 text-foreground/50"}`}>
        {enabled ? "Enabled" : "Not configured"}
      </span>
    </div>
  )
}
