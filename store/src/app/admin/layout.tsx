import "../globals.css"

// Admin dashboard is a separate route tree from [locale]/* (English-only UI),
// so it needs its own <html>/<body> — Next.js requires exactly one per route.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  )
}
