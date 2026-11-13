import {
  Stethoscope,
  Syringe,
  Scissors,
  Smile,
  HeartPulse,
  ShieldCheck,
  ArrowRight,
  PawPrint,
  Info,
} from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { useBooking } from '../booking/BookingContext.jsx'
import { SERVICES } from '../data/site.js'

const ICONS = { Stethoscope, Syringe, Scissors, Smile, HeartPulse, ShieldCheck }

export default function Services() {
  const { t, dir } = useLang()
  const { openBooking } = useBooking()
  const Arrow = dir === 'rtl' ? ArrowRight : ArrowRight

  return (
    <section id="services" className="section services">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">
            <PawPrint size={14} /> {t('services.eyebrow')}
          </span>
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-sub">{t('services.sub')}</p>
        </div>

        <div className="services__grid">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon]
            return (
              <article
                className="service-card reveal"
                data-delay={(i % 3) + 1}
                key={s.key}
              >
                <span className="service-card__icon">
                  <Icon size={26} />
                </span>
                <h3 className="service-card__title">
                  {t(`services.items.${s.key}.name`)}
                </h3>
                <p className="service-card__desc">
                  {t(`services.items.${s.key}.desc`)}
                </p>
                <button
                  className="service-card__link"
                  onClick={() => openBooking(s.key)}
                >
                  {t('services.book')}
                  <Arrow size={16} className="service-card__arrow" />
                </button>
              </article>
            )
          })}
        </div>

        <p className="services__note reveal">
          <Info size={15} />
          {t('services.disclaimer')}
        </p>
      </div>
    </section>
  )
}
