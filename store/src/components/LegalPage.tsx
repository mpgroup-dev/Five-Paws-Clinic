export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">{title}</h1>
      <div className="space-y-5 text-sm leading-relaxed text-foreground/80 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground">
        {children}
      </div>
    </div>
  )
}
