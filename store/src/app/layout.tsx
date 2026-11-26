import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Five Paws | فايف باوز",
  description: "Premium pet supplies, delivered across Saudi Arabia.",
}

// Intentionally minimal: <html>/<body> live in app/[locale]/layout.tsx so we
// can set the correct lang/dir per locale (next-intl-style root pattern).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
