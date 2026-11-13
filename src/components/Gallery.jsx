import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, PawPrint, ZoomIn } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { GALLERY } from '../data/site.js'

export default function Gallery() {
  const { t, dir } = useLang()
  const [index, setIndex] = useState(-1)
  const open = index >= 0
  const closeBtnRef = useRef(null)

  const close = useCallback(() => setIndex(-1), [])
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + GALLERY.length) % GALLERY.length),
    [],
  )
  const next = useCallback(() => setIndex((i) => (i + 1) % GALLERY.length), [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') dir === 'rtl' ? next() : prev()
      else if (e.key === 'ArrowRight') dir === 'rtl' ? prev() : next()
    }
    window.addEventListener('keydown', onKey)
    closeBtnRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, prev, next, dir])

  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">
            <PawPrint size={14} /> {t('gallery.eyebrow')}
          </span>
          <h2 className="section-title">{t('gallery.title')}</h2>
          <p className="section-sub">{t('gallery.sub')}</p>
        </div>

        <div className="gallery__grid">
          {GALLERY.map((img, i) => (
            <button
              key={img.src}
              className={`gallery__item ${img.span ? `gallery__item--${img.span}` : ''} reveal`}
              data-delay={(i % 4) + 1}
              onClick={() => setIndex(i)}
              aria-label={`${t('gallery.imageAlt')} ${i + 1}`}
            >
              <img src={img.src} alt={`${t('gallery.imageAlt')} ${i + 1}`} loading="lazy" />
              <span className="gallery__item-zoom">
                <ZoomIn size={20} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t('gallery.title')}
          onClick={close}
        >
          <button
            className="lightbox__close"
            onClick={close}
            ref={closeBtnRef}
            aria-label={t('booking.close')}
          >
            <X size={24} />
          </button>

          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={30} />
          </button>

          <figure className="lightbox__stage" onClick={(e) => e.stopPropagation()}>
            <img
              src={GALLERY[index].src}
              alt={`${t('gallery.imageAlt')} ${index + 1}`}
              className="lightbox__img"
            />
            <figcaption className="lightbox__caption">
              <span className="lightbox__counter">
                {index + 1} / {GALLERY.length}
              </span>
              <span className="lightbox__hint">{t('gallery.lightboxHint')}</span>
            </figcaption>
          </figure>

          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Next"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </section>
  )
}
