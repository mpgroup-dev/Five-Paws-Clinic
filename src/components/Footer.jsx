import { Phone, MapPin, MessageCircle, Facebook, Navigation, Heart, PawPrint } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { useBooking } from '../booking/BookingContext.jsx'
import { CLINIC, LOGO_MARK } from '../data/site.js'

const LINKS = [
  { id: 'home', key: 'nav.home' },
  { id: 'about', key: 'nav.about' },
  { id: 'services', key: 'nav.services' },
  { id: 'gallery', key: 'nav.gallery' },
  { id: 'reviews', key: 'nav.reviews' },
  { id: 'contact', key: 'nav.contact' },
]

export default function Footer() {
  const { t } = useLang()
  const { openBooking } = useBooking()
  const year = new Date().getFullYear()

  const go = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer__top-wave" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <img src={LOGO_MARK} alt="Five Paws Clinic" width="56" height="56" />
            <div>
              <strong>Five Paws</strong>
              <span>{t('nav.brandSub')}</span>
            </div>
          </div>
          <p className="footer__about">{t('footer.about')}</p>
          <button className="btn btn--accent btn--sm" onClick={() => openBooking()}>
            <PawPrint size={16} /> {t('nav.book')}
          </button>
        </div>

        <div className="footer__col">
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)}>
                  {t(l.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>{t('footer.contact')}</h4>
          <ul className="footer__contact">
            <li>
              <a href={`tel:${CLINIC.phoneRaw}`}>
                <Phone size={16} /> <span dir="ltr">{CLINIC.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={CLINIC.maps} target="_blank" rel="noopener noreferrer">
                <MapPin size={16} /> {t('contact.locationValue')}
              </a>
            </li>
          </ul>

          <h4 className="footer__social-head">{t('footer.social')}</h4>
          <div className="footer__social">
            <a href={CLINIC.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={t('common.whatsapp')}>
              <MessageCircle size={18} />
            </a>
            <a href={CLINIC.facebook} target="_blank" rel="noopener noreferrer" aria-label={t('common.facebook')}>
              <Facebook size={18} />
            </a>
            <a href={CLINIC.maps} target="_blank" rel="noopener noreferrer" aria-label={t('common.viewMaps')}>
              <Navigation size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>
            © {year} {CLINIC.name}. {t('footer.rights')}
          </p>
          <p className="footer__made">
            {t('footer.madeWith')} <Heart size={13} fill="currentColor" strokeWidth={0} />
          </p>
        </div>
        <p className="footer__demo container">{t('footer.demo')}</p>
      </div>
    </footer>
  )
}
