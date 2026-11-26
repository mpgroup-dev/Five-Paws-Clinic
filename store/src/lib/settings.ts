// Default store settings. All of these are stored in the StoreSetting table
// and editable from the admin dashboard — nothing here is hardcoded into the
// checkout logic itself, these are just the initial seed values.
//
// Shipping: the client said to cover all of Saudi Arabia as a single zone for
// now, with the actual fee/thresholds to be refined once real courier rates
// are confirmed. These are sensible, clearly-editable starting defaults.

export const DEFAULT_SETTINGS = {
  storeName: "Five Paws",
  storeNameAr: "فايف باوز",
  currency: "SAR",
  vatRatePercent: 15, // Saudi Arabia's standard VAT rate
  shipping: {
    flatRateSar: 25,
    freeShippingThresholdSar: 200,
    estimatedDeliveryDays: "2-5",
    coverage: "All regions of Saudi Arabia",
    coverageAr: "جميع مناطق المملكة العربية السعودية",
  },
  notifications: {
    emailEnabled: false,
    whatsappEnabled: false,
    smsEnabled: false,
    provider: null as string | null,
  },
  payment: {
    provider: null as string | null, // Tap / PayTabs / HyperPay / Moyasar — TBD
    live: false,
  },
} as const

export type StoreSettings = typeof DEFAULT_SETTINGS

// The Five Paws clinic site (separate app). Falls back to the local dev
// server; set NEXT_PUBLIC_CLINIC_URL once the clinic has a production domain.
export const CLINIC_URL = process.env.NEXT_PUBLIC_CLINIC_URL || "http://localhost:5173"
