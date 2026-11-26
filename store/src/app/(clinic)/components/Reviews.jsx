import { Star, Quote, MapPin, Info } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { CLINIC } from '../data/site.js'

function Stars({ value = 5, size = 18 }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          fill={i < value ? 'currentColor' : 'rgba(0,0,0,.12)'}
        />
      ))}
    </span>
  )
}

export default function Reviews() {
  const { t } = useLang()
  const cards = t('reviews.cards')

  return (
    <section id="reviews" className="section reviews">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">
            <Star size={14} fill="currentColor" strokeWidth={0} /> {t('reviews.eyebrow')}
          </span>
          <h2 className="section-title">{t('reviews.title')}</h2>
          <p className="section-sub">{t('reviews.sub')}</p>
        </div>

        <div className="reviews__layout">
          <div className="score-card reveal">
            <div className="score-card__big">{CLINIC.rating.toFixed(1)}</div>
            <Stars value={5} size={22} />
            <p className="score-card__label">
              {t('reviews.scoreLabel')} · {t('reviews.outOf')}
            </p>
            <a
              className="btn btn--primary btn--block"
              href={CLINIC.maps}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin size={18} />
              {t('reviews.cta')}
            </a>
            <span className="score-card__google">
              <GoogleG /> Google
            </span>
          </div>

          <div className="reviews__cards">
            {Array.isArray(cards) &&
              cards.map((c, i) => (
                <figure className="review-card reveal" data-delay={(i % 3) + 1} key={i}>
                  <span className="review-card__tag">{t('reviews.demoTag')}</span>
                  <Quote className="review-card__quote" size={26} />
                  <blockquote>{c.text}</blockquote>
                  <figcaption>
                    <Stars value={5} size={14} />
                    <span>{c.author}</span>
                  </figcaption>
                </figure>
              ))}
          </div>
        </div>

        <p className="reviews__disclaimer reveal">
          <Info size={15} />
          {t('reviews.disclaimer')}
        </p>
      </div>
    </section>
  )
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12c-.2 1.9-1.6 4.7-4.5 6.6l6.9 5.3c4.1-3.8 6.7-9.4 6.7-15.2z" />
      <path fill="#34A853" d="M24 46c6.1 0 11.2-2 14.9-5.4l-6.9-5.3c-1.9 1.3-4.4 2.2-8 2.2-6.1 0-11.3-4.1-13.2-9.7l-7.1 5.5C4.3 40.6 13.4 46 24 46z" />
      <path fill="#FBBC05" d="M10.8 27.8c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.1-5.5C2 16 1 19.9 1 23s1 7 2.7 10.3l7.1-5.5z" />
      <path fill="#EA4335" d="M24 10.5c3.4 0 5.7 1.5 7 2.7l5.1-5C32.9 5.3 29.1 3.5 24 3.5 13.4 3.5 4.3 8.9 1.7 16.7l7.1 5.5C10.7 16.6 15.9 10.5 24 10.5z" />
    </svg>
  )
}
