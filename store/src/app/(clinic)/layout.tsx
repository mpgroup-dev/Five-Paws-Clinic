import type { Metadata } from "next"
import "./styles/index.css"
import "./styles/layout.css"
import "./styles/sections.css"
import "./styles/booking.css"

export const metadata: Metadata = {
  title: "Five Paws Clinic | عيادة فايف باوز",
  description:
    "Veterinary clinic in Dammam, Saudi Arabia — consultations, vaccination, grooming and more.",
}

// The clinic is a separate route group from the store ([locale]/*) and admin,
// so it gets its own <html>/<body> and only loads its own CSS — never Tailwind.
export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body>{children}</body>
    </html>
  )
}
