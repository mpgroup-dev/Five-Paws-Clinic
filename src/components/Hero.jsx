import { Star, CalendarHeart, PhoneCall, PawPrint, ShieldCheck, Scissors, Stethoscope } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { useBooking } from '../booking/BookingContext.jsx'
import { CLINIC, HERO_IMG, HERO_IMG_SM } from '../data/site.js'

function Stars({ value = 5, size = 16 }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} strokeWidth={0} fill={i < value ? 'currentColor' : 'rgba(0,0,0,.12)'} />
      ))}
    </span>
  )
}

export default function Hero() {
  const { t } = useLang()
  const { openBooking } = useBooking()

  const miniStats = [
    { icon: Stethoscope, label: t('hero.stat1'), value: t('hero.stat1v') },
    { icon: ShieldCheck, label: t('hero.stat2'), value: t('hero.stat2v') },
    { icon: Scissors, label: t('hero.stat3'), value: t('hero.stat3v') },
  ]

  return (
    <section id="home" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <PawPrint className="hero__paw hero__paw--1" />
        <PawPrint className="hero__paw hero__paw--2" />
        <PawPrint className="hero__paw hero__paw--3" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__badge reveal">
            <Stars value={5} size={15} />
            <strong>{CLINIC.rating}</strong>
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="hero__title reveal" data-delay="1">
            <span>{t('hero.title1')}</span>
            <span className="hero__title-accent">{t('hero.title2')}</span>
          </h1>

          <p className="hero__sub reveal" data-delay="2">
            {t('hero.subtitle')}
          </p>

          <div className="hero__cta reveal" data-delay="3">
            <button className="btn btn--primary btn--lg" onClick={() => openBooking()}>
              <CalendarHeart size={20} />
              {t('common.bookNow')}
            </button>
            <a href="#contact" className="btn btn--ghost btn--lg">
              <PhoneCall size={18} />
              {t('common.contactUs')}
            </a>
          </div>

          <div className="hero__stats reveal" data-delay="4">
            {miniStats.map((s, i) => (
              <div className="hero__stat" key={i}>
                <span className="hero__stat-ic">
                  <s.icon size={20} />
                </span>
                <span className="hero__stat-text">
                  <strong>{s.label}</strong>
                  <em>{s.value}</em>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__media reveal" data-delay="2">
          <div className="hero__frame">
            <img src={HERO_IMG} alt={t('hero.imageAlt')} className="hero__img" width="620" height="760" />
            <div className="hero__glow" aria-hidden="true" />
          </div>

          <div className="hero__float hero__float--rating">
            <span className="hero__float-score">{CLINIC.rating}</span>
            <span className="hero__float-meta">
              <Stars value={5} size={13} />
              <small>{t('hero.ratingLabel')}</small>
            </span>
          </div>

          <div className="hero__float hero__float--pets">
            <img src={HERO_IMG_SM} alt="" />
            <span>
              <PawPrint size={15} />
              {t('hero.trust')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
