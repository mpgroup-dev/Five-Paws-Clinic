import { Check, PawPrint, Quote } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { ABOUT_IMGS } from '../data/site.js'

export default function About() {
  const { t } = useLang()
  const points = ['about.point1', 'about.point2', 'about.point3', 'about.point4']

  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <div className="about__media reveal">
          <div className="about__media-main">
            <img src={ABOUT_IMGS.main} alt={t('about.title')} loading="lazy" />
          </div>
          <div className="about__media-tl">
            <img src={ABOUT_IMGS.tl} alt="" loading="lazy" />
          </div>
          <div className="about__media-br">
            <img src={ABOUT_IMGS.br} alt="" loading="lazy" />
          </div>
          <div className="about__quote">
            <Quote size={22} />
            <p>{t('about.quote')}</p>
          </div>
        </div>

        <div className="about__content reveal" data-delay="1">
          <span className="eyebrow">
            <PawPrint size={14} /> {t('about.eyebrow')}
          </span>
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="section-sub">{t('about.body1')}</p>
          <p className="about__body2">{t('about.body2')}</p>

          <ul className="about__points">
            {points.map((p) => (
              <li key={p}>
                <span className="about__check">
                  <Check size={15} strokeWidth={3} />
                </span>
                {t(p)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
