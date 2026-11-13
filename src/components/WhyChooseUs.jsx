import { HeartHandshake, Home, Sparkles, CalendarCheck, PawPrint } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { WHY, WHY_IMG } from '../data/site.js'

const ICONS = { HeartHandshake, Home, Sparkles, CalendarCheck }

export default function WhyChooseUs() {
  const { t } = useLang()

  return (
    <section className="section why">
      <div className="container why__grid">
        <div className="why__media reveal">
          <img src={WHY_IMG} alt={t('why.title')} loading="lazy" />
          <div className="why__media-badge">
            <PawPrint size={18} />
            <span>{t('about.quote')}</span>
          </div>
        </div>

        <div className="why__content">
          <div className="section-head reveal">
            <span className="eyebrow">
              <PawPrint size={14} /> {t('why.eyebrow')}
            </span>
            <h2 className="section-title">{t('why.title')}</h2>
            <p className="section-sub">{t('why.sub')}</p>
          </div>

          <div className="why__list">
            {WHY.map((w, i) => {
              const Icon = ICONS[w.icon]
              return (
                <div className="why-card reveal" data-delay={(i % 2) + 1} key={w.key}>
                  <span className="why-card__icon">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className="why-card__title">{t(`why.items.${w.key}.name`)}</h3>
                    <p className="why-card__desc">{t(`why.items.${w.key}.desc`)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
