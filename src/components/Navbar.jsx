import { useEffect, useState } from 'react'
import { Menu, X, PawPrint, CalendarHeart, ShoppingBag } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { useBooking } from '../booking/BookingContext.jsx'
import { LOGO, STORE_URL } from '../data/site.js'

const LINKS = [
  { id: 'home', key: 'nav.home' },
  { id: 'about', key: 'nav.about' },
  { id: 'services', key: 'nav.services' },
  { id: 'gallery', key: 'nav.gallery' },
  { id: 'reviews', key: 'nav.reviews' },
  { id: 'contact', key: 'nav.contact' },
]

export default function Navbar() {
  const { t } = useLang()
  const { openBooking } = useBooking()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#home" className="brand" onClick={go('home')} aria-label={t('nav.brandSub')}>
          <img src={LOGO} alt="" className="brand__logo" width="48" height="48" />
          <span className="brand__text">
            <span className="brand__name">Five Paws</span>
            <span className="brand__sub">{t('nav.brandSub')}</span>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className="nav__link">
              {t(l.key)}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a
            className="btn btn--outline btn--sm nav__shop"
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ShoppingBag size={18} />
            <span>{t('nav.shop')}</span>
          </a>
          <button className="btn btn--primary btn--sm nav__book" onClick={() => openBooking()}>
            <CalendarHeart size={18} />
            <span>{t('nav.book')}</span>
          </button>
          <button
            className="nav__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`drawer ${open ? 'drawer--open' : ''}`} aria-hidden={!open}>
        <nav className="drawer__links" aria-label="Mobile">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className="drawer__link">
              <PawPrint size={16} />
              {t(l.key)}
            </a>
          ))}
        </nav>
        <div className="drawer__actions">
          <a
            className="btn btn--outline btn--block"
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            <ShoppingBag size={18} />
            {t('nav.shop')}
          </a>
          <button
            className="btn btn--primary btn--block"
            onClick={() => {
              setOpen(false)
              openBooking()
            }}
          >
            <CalendarHeart size={18} />
            {t('nav.book')}
          </button>
        </div>
      </div>
      {open && <button className="drawer__scrim" aria-label={t('booking.close')} onClick={() => setOpen(false)} />}
    </header>
  )
}
