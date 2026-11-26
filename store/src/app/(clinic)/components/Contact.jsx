import { Phone, MapPin, Clock, MessageCircle, Facebook, Navigation, CalendarHeart, PawPrint } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { useBooking } from '../booking/BookingContext.jsx'
import { CLINIC, CONTACT_IMG } from '../data/site.js'

export default function Contact() {
  const { t } = useLang()
  const { openBooking } = useBooking()

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">
            <MapPin size={14} /> {t('contact.eyebrow')}
          </span>
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="section-sub">{t('contact.sub')}</p>
        </div>

        <div className="contact__grid">
          <div className="contact__info reveal">
            <a className="contact__row" href={`tel:${CLINIC.phoneRaw}`}>
              <span className="contact__row-ic"><Phone size={20} /></span>
              <span className="contact__row-text">
                <small>{t('contact.phoneLabel')}</small>
                <strong dir="ltr">{CLINIC.phoneDisplay}</strong>
              </span>
            </a>

            <a
              className="contact__row"
              href={CLINIC.maps}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact__row-ic"><MapPin size={20} /></span>
              <span className="contact__row-text">
                <small>{t('contact.locationLabel')}</small>
                <strong>{t('contact.locationValue')}</strong>
              </span>
            </a>

            <div className="contact__row contact__row--static">
              <span className="contact__row-ic"><Clock size={20} /></span>
              <span className="contact__row-text">
                <small>{t('contact.hoursLabel')}</small>
                <strong>{t('contact.hoursValue')}</strong>
                <em className="contact__demo-tag">{t('contact.hoursDemo')}</em>
              </span>
            </div>

            <div className="contact__social">
              <span className="contact__social-label">{t('contact.socialLabel')}</span>
              <div className="contact__social-btns">
                <a
                  className="btn btn--whatsapp btn--sm"
                  href={CLINIC.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={17} /> {t('common.whatsapp')}
                </a>
                <a
                  className="social-chip social-chip--fb"
                  href={CLINIC.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('common.facebook')}
                >
                  <Facebook size={18} />
                </a>
                <a
                  className="social-chip social-chip--map"
                  href={CLINIC.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('common.viewMaps')}
                >
                  <Navigation size={18} />
                </a>
              </div>
            </div>

            <div className="contact__book-card">
              <div>
                <strong>{t('contact.bookCard')}</strong>
                <p>{t('contact.bookCardSub')}</p>
              </div>
              <button className="btn btn--accent btn--sm" onClick={() => openBooking()}>
                <CalendarHeart size={17} />
                {t('nav.book')}
              </button>
            </div>
          </div>

          <div className="contact__map reveal" data-delay="1">
            <img src={CONTACT_IMG} alt={t('contact.mapTitle')} loading="lazy" />
            <div className="contact__map-overlay">
              <span className="contact__map-pin">
                <MapPin size={22} />
              </span>
              <div className="contact__map-text">
                <strong>{CLINIC.name}</strong>
                <span>{t('contact.locationValue')}</span>
              </div>
              <a
                className="btn btn--primary btn--sm"
                href={CLINIC.maps}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation size={16} />
                {t('contact.mapCta')}
              </a>
            </div>
            <span className="contact__map-badge">
              <PawPrint size={14} /> {t('common.getDirections')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
