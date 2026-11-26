import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Stethoscope,
  Syringe,
  Scissors,
  Smile,
  HeartPulse,
  ShieldCheck,
  Cat,
  Dog,
  Bird,
  PawPrint,
  AlertCircle,
  CalendarDays,
  Clock,
  MessageCircle,
  Home,
  Info,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext.jsx'
import { useBooking } from '../../booking/BookingContext.jsx'
import { SERVICES, CLINIC } from '../../data/site.js'
import {
  TIME_SLOTS,
  getSimulatedBooked,
  isSlotTakenBySession,
  saveBooking,
  makeRef,
  todayISO,
  formatDate,
  isValidPhone,
  isValidEmail,
} from '../../booking/bookingData.js'

const SERVICE_ICONS = { Stethoscope, Syringe, Scissors, Smile, HeartPulse, ShieldCheck }
const PET_ICONS = { cat: Cat, dog: Dog, bird: Bird, other: PawPrint }

const STEP_KEYS = ['service', 'pet', 'owner', 'schedule', 'notes', 'review']
const STEP_ICONS = [Sparkles, PawPrint, Home, CalendarDays, MessageCircle, Check]

const emptyData = {
  service: null,
  pet: { name: '', type: '', breed: '', age: '', gender: '' },
  owner: { name: '', phone: '', email: '' },
  schedule: { date: '', time: '' },
  notes: '',
}

export default function BookingModal() {
  const { t, lang, dir } = useLang()
  const { isOpen, preselect, closeBooking } = useBooking()

  const [step, setStep] = useState(0)
  const [data, setData] = useState(emptyData)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(null)
  const dialogRef = useRef(null)

  // init on open
  useEffect(() => {
    if (isOpen) {
      setSuccess(null)
      setErrors({})
      if (preselect) {
        setData({ ...emptyData, service: preselect })
        setStep(1)
      } else {
        setData(emptyData)
        setStep(0)
      }
    }
  }, [isOpen, preselect])

  // body lock + esc + focus
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') closeBooking()
    }
    window.addEventListener('keydown', onKey)
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeBooking])

  const setPet = (patch) => setData((d) => ({ ...d, pet: { ...d.pet, ...patch } }))
  const setOwner = (patch) => setData((d) => ({ ...d, owner: { ...d.owner, ...patch } }))
  const setSchedule = (patch) =>
    setData((d) => ({ ...d, schedule: { ...d.schedule, ...patch } }))

  const simulatedBooked = useMemo(
    () => getSimulatedBooked(data.schedule.date),
    [data.schedule.date],
  )

  const validate = useCallback(
    (s) => {
      const e = {}
      if (s === 0) {
        if (!data.service) e.service = t('booking.errors.service')
      } else if (s === 1) {
        if (!data.pet.name.trim()) e.petName = t('booking.errors.petName')
        if (!data.pet.type) e.petType = t('booking.errors.petType')
      } else if (s === 2) {
        if (!data.owner.name.trim()) e.ownerName = t('booking.errors.ownerName')
        if (!data.owner.phone.trim()) e.phone = t('booking.errors.phoneReq')
        else if (!isValidPhone(data.owner.phone)) e.phone = t('booking.errors.phoneInvalid')
        if (data.owner.email.trim() && !isValidEmail(data.owner.email))
          e.email = t('booking.errors.email')
      } else if (s === 3) {
        if (!data.schedule.date) e.date = t('booking.errors.date')
        else if (data.schedule.date < todayISO()) e.date = t('booking.errors.pastDate')
        if (!data.schedule.time) e.time = t('booking.errors.time')
        else if (
          data.schedule.date &&
          isSlotTakenBySession(data.schedule.date, data.schedule.time)
        )
          e.time = t('booking.errors.duplicate')
      }
      return e
    },
    [data, t],
  )

  const next = () => {
    const e = validate(step)
    setErrors(e)
    if (Object.keys(e).length === 0) {
      setStep((s) => Math.min(s + 1, STEP_KEYS.length - 1))
    }
  }

  const back = () => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  const goTo = (s) => {
    setErrors({})
    setStep(s)
  }

  const confirm = () => {
    // final guard across all steps
    for (let s = 0; s <= 3; s++) {
      const e = validate(s)
      if (Object.keys(e).length) {
        setErrors(e)
        setStep(s)
        return
      }
    }
    const booking = {
      ref: makeRef(),
      ...data,
      createdAt: new Date().toISOString(),
    }
    saveBooking(booking)
    setSuccess(booking)
  }

  if (!isOpen) return null

  const Prev = dir === 'rtl' ? ChevronRight : ChevronLeft
  const Next = dir === 'rtl' ? ChevronLeft : ChevronRight

  return (
    <div className="bk" role="dialog" aria-modal="true" aria-label={t('booking.title')}>
      <button className="bk__scrim" aria-label={t('booking.close')} onClick={closeBooking} />
      <div className="bk__panel" ref={dialogRef} tabIndex={-1}>
        <button className="bk__close" onClick={closeBooking} aria-label={t('booking.close')}>
          <X size={22} />
        </button>

        {success ? (
          <SuccessView booking={success} onClose={closeBooking} lang={lang} t={t} />
        ) : (
          <>
            <header className="bk__header">
              <div className="bk__title-row">
                <span className="bk__title-ic"><PawPrint size={20} /></span>
                <div>
                  <h2>{t('booking.title')}</h2>
                  <p>{t('booking.subtitle')}</p>
                </div>
              </div>
              <Stepper step={step} onJump={goTo} t={t} />
            </header>

            <div className="bk__body" key={step}>
              {step === 0 && <ServiceStep data={data} setData={setData} errors={errors} t={t} />}
              {step === 1 && <PetStep data={data} setPet={setPet} errors={errors} t={t} />}
              {step === 2 && <OwnerStep data={data} setOwner={setOwner} errors={errors} t={t} />}
              {step === 3 && (
                <ScheduleStep
                  data={data}
                  setSchedule={setSchedule}
                  errors={errors}
                  booked={simulatedBooked}
                  t={t}
                />
              )}
              {step === 4 && <NotesStep data={data} setData={setData} t={t} />}
              {step === 5 && <ReviewStep data={data} goTo={goTo} t={t} lang={lang} />}
            </div>

            <footer className="bk__footer">
              <p className="bk__demo">
                <Info size={14} /> {t('booking.demoBanner')}
              </p>
              <div className="bk__nav">
                {step > 0 ? (
                  <button className="btn btn--ghost btn--sm" onClick={back}>
                    <Prev size={18} /> {t('booking.back')}
                  </button>
                ) : (
                  <span />
                )}
                {step < STEP_KEYS.length - 1 ? (
                  <button className="btn btn--primary" onClick={next}>
                    {t('booking.next')} <Next size={18} />
                  </button>
                ) : (
                  <button className="btn btn--accent" onClick={confirm}>
                    <Check size={18} /> {t('booking.confirm')}
                  </button>
                )}
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}

/* ----------------------------- Stepper ----------------------------- */
function Stepper({ step, onJump, t }) {
  return (
    <ol className="bk-steps">
      {STEP_KEYS.map((key, i) => {
        const Icon = STEP_ICONS[i]
        const state = i === step ? 'active' : i < step ? 'done' : 'todo'
        return (
          <li key={key} className={`bk-steps__item bk-steps__item--${state}`}>
            <button
              className="bk-steps__dot"
              disabled={i > step}
              onClick={() => i < step && onJump(i)}
              aria-label={t(`booking.steps.${key}`)}
            >
              {state === 'done' ? <Check size={15} strokeWidth={3} /> : <Icon size={15} />}
            </button>
            <span className="bk-steps__label">{t(`booking.steps.${key}`)}</span>
          </li>
        )
      })}
    </ol>
  )
}

/* --------------------------- Field helpers --------------------------- */
function Field({ label, error, children, optional, t }) {
  return (
    <label className={`bk-field ${error ? 'bk-field--error' : ''}`}>
      <span className="bk-field__label">
        {label}
        {optional && <em className="bk-field__opt">({t('booking.pet.breedPh')})</em>}
      </span>
      {children}
      {error && (
        <span className="bk-field__err">
          <AlertCircle size={13} /> {error}
        </span>
      )}
    </label>
  )
}

function StepHead({ title, sub }) {
  return (
    <div className="bk-step__head">
      <h3>{title}</h3>
      <p>{sub}</p>
    </div>
  )
}

/* ----------------------------- Step 1: Service ----------------------------- */
function ServiceStep({ data, setData, errors, t }) {
  return (
    <div className="bk-step">
      <StepHead title={t('booking.service.title')} sub={t('booking.service.sub')} />
      <div className="bk-services">
        {SERVICES.map((s) => {
          const Icon = SERVICE_ICONS[s.icon]
          const active = data.service === s.key
          return (
            <button
              key={s.key}
              className={`bk-service ${active ? 'bk-service--active' : ''}`}
              onClick={() => setData((d) => ({ ...d, service: s.key }))}
              aria-pressed={active}
            >
              <span className="bk-service__ic"><Icon size={22} /></span>
              <span className="bk-service__name">{t(`services.items.${s.key}.name`)}</span>
              {active && <span className="bk-service__check"><Check size={14} strokeWidth={3} /></span>}
            </button>
          )
        })}
      </div>
      {errors.service && (
        <span className="bk-field__err bk-field__err--block">
          <AlertCircle size={13} /> {errors.service}
        </span>
      )}
    </div>
  )
}

/* ----------------------------- Step 2: Pet ----------------------------- */
function PetStep({ data, setPet, errors, t }) {
  const types = ['cat', 'dog', 'bird', 'other']
  const genders = ['male', 'female', 'unknown']
  return (
    <div className="bk-step">
      <StepHead title={t('booking.pet.title')} sub={t('booking.pet.sub')} />
      <div className="bk-grid">
        <Field label={t('booking.pet.name')} error={errors.petName} t={t}>
          <input
            type="text"
            className="bk-input"
            value={data.pet.name}
            onChange={(e) => setPet({ name: e.target.value })}
            placeholder={t('booking.pet.namePh')}
            maxLength={40}
          />
        </Field>

        <div className="bk-field bk-field--full">
          <span className="bk-field__label">{t('booking.pet.type')}</span>
          <div className="bk-choice bk-choice--4">
            {types.map((ty) => {
              const Icon = PET_ICONS[ty]
              const active = data.pet.type === ty
              return (
                <button
                  key={ty}
                  className={`bk-chip ${active ? 'bk-chip--active' : ''}`}
                  onClick={() => setPet({ type: ty })}
                  aria-pressed={active}
                >
                  <Icon size={18} />
                  {t(`booking.pet.types.${ty}`)}
                </button>
              )
            })}
          </div>
          {errors.petType && (
            <span className="bk-field__err">
              <AlertCircle size={13} /> {errors.petType}
            </span>
          )}
        </div>

        <Field label={`${t('booking.pet.breed')}`} t={t}>
          <input
            type="text"
            className="bk-input"
            value={data.pet.breed}
            onChange={(e) => setPet({ breed: e.target.value })}
            placeholder={t('booking.pet.breedPh')}
            maxLength={40}
          />
        </Field>

        <Field label={`${t('booking.pet.age')}`} t={t}>
          <input
            type="text"
            className="bk-input"
            value={data.pet.age}
            onChange={(e) => setPet({ age: e.target.value })}
            placeholder={t('booking.pet.agePh')}
            maxLength={24}
          />
        </Field>

        <div className="bk-field bk-field--full">
          <span className="bk-field__label">{t('booking.pet.gender')}</span>
          <div className="bk-choice bk-choice--3">
            {genders.map((g) => {
              const active = data.pet.gender === g
              return (
                <button
                  key={g}
                  className={`bk-chip ${active ? 'bk-chip--active' : ''}`}
                  onClick={() => setPet({ gender: g })}
                  aria-pressed={active}
                >
                  {t(`booking.pet.genders.${g}`)}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- Step 3: Owner ----------------------------- */
function OwnerStep({ data, setOwner, errors, t }) {
  return (
    <div className="bk-step">
      <StepHead title={t('booking.owner.title')} sub={t('booking.owner.sub')} />
      <div className="bk-grid">
        <Field label={t('booking.owner.name')} error={errors.ownerName} t={t}>
          <input
            type="text"
            className="bk-input"
            value={data.owner.name}
            onChange={(e) => setOwner({ name: e.target.value })}
            placeholder={t('booking.owner.namePh')}
            maxLength={60}
            autoComplete="name"
          />
        </Field>

        <Field label={t('booking.owner.phone')} error={errors.phone} t={t}>
          <input
            type="tel"
            className="bk-input"
            dir="ltr"
            value={data.owner.phone}
            onChange={(e) => setOwner({ phone: e.target.value })}
            placeholder={t('booking.owner.phonePh')}
            maxLength={20}
            autoComplete="tel"
          />
        </Field>

        <Field label={t('booking.owner.email')} error={errors.email} t={t}>
          <input
            type="email"
            className="bk-input"
            dir="ltr"
            value={data.owner.email}
            onChange={(e) => setOwner({ email: e.target.value })}
            placeholder={t('booking.owner.emailPh')}
            maxLength={80}
            autoComplete="email"
          />
        </Field>
      </div>
    </div>
  )
}

/* ----------------------------- Step 4: Schedule ----------------------------- */
function ScheduleStep({ data, setSchedule, errors, booked, t }) {
  const min = todayISO()
  return (
    <div className="bk-step">
      <StepHead title={t('booking.schedule.title')} sub={t('booking.schedule.sub')} />
      <Field label={t('booking.schedule.date')} error={errors.date} t={t}>
        <div className="bk-date">
          <CalendarDays size={18} className="bk-date__ic" />
          <input
            type="date"
            className="bk-input bk-input--date"
            value={data.schedule.date}
            min={min}
            onChange={(e) => setSchedule({ date: e.target.value, time: '' })}
          />
        </div>
      </Field>

      <div className="bk-field bk-field--full">
        <span className="bk-field__label">
          <Clock size={15} /> {t('booking.schedule.time')}
        </span>
        {!data.schedule.date ? (
          <p className="bk-slots__empty">
            <Info size={15} /> {t('booking.schedule.pickDate')}
          </p>
        ) : (
          <>
            <div className="bk-slots">
              {TIME_SLOTS.map((slot) => {
                const taken =
                  booked.has(slot) || isSlotTakenBySession(data.schedule.date, slot)
                const active = data.schedule.time === slot
                return (
                  <button
                    key={slot}
                    className={`bk-slot ${active ? 'bk-slot--active' : ''} ${taken ? 'bk-slot--taken' : ''}`}
                    disabled={taken}
                    onClick={() => setSchedule({ time: slot })}
                    aria-pressed={active}
                  >
                    {slot}
                    {taken && <small>{t('booking.schedule.booked')}</small>}
                  </button>
                )
              })}
            </div>
            <p className="bk-slots__note">
              <Info size={13} /> {t('booking.schedule.demoNote')}
            </p>
          </>
        )}
        {errors.time && (
          <span className="bk-field__err">
            <AlertCircle size={13} /> {errors.time}
          </span>
        )}
      </div>
    </div>
  )
}

/* ----------------------------- Step 5: Notes ----------------------------- */
function NotesStep({ data, setData, t }) {
  return (
    <div className="bk-step">
      <StepHead title={t('booking.notes.title')} sub={t('booking.notes.sub')} />
      <label className="bk-field bk-field--full">
        <span className="bk-field__label">{t('booking.notes.label')}</span>
        <textarea
          className="bk-input bk-textarea"
          rows={5}
          value={data.notes}
          onChange={(e) => setData((d) => ({ ...d, notes: e.target.value }))}
          placeholder={t('booking.notes.ph')}
          maxLength={500}
        />
        <span className="bk-count">{data.notes.length}/500</span>
      </label>
    </div>
  )
}

/* ----------------------------- Step 6: Review ----------------------------- */
function ReviewStep({ data, goTo, t, lang }) {
  const rows = [
    {
      label: t('booking.review.service'),
      step: 0,
      value: data.service ? t(`services.items.${data.service}.name`) : t('booking.review.none'),
    },
    {
      label: t('booking.review.pet'),
      step: 1,
      value: [
        data.pet.name,
        data.pet.type && t(`booking.pet.types.${data.pet.type}`),
        data.pet.breed,
        data.pet.age,
        data.pet.gender && t(`booking.pet.genders.${data.pet.gender}`),
      ]
        .filter(Boolean)
        .join(' · '),
    },
    {
      label: t('booking.review.owner'),
      step: 2,
      value: [data.owner.name, data.owner.phone, data.owner.email].filter(Boolean).join(' · '),
    },
    {
      label: t('booking.review.schedule'),
      step: 3,
      value: `${formatDate(data.schedule.date, lang)} — ${data.schedule.time}`,
    },
    {
      label: t('booking.review.notes'),
      step: 4,
      value: data.notes.trim() || t('booking.review.none'),
    },
  ]
  return (
    <div className="bk-step">
      <StepHead title={t('booking.review.title')} sub={t('booking.review.sub')} />
      <div className="bk-review">
        {rows.map((r) => (
          <div className="bk-review__row" key={r.label}>
            <span className="bk-review__label">{r.label}</span>
            <span className="bk-review__value">{r.value}</span>
            <button className="bk-review__edit" onClick={() => goTo(r.step)}>
              {t('booking.edit')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------- Success ----------------------------- */
function SuccessView({ booking, onClose, lang, t }) {
  const waText = encodeURIComponent(
    `${t('booking.success.title')} ${booking.ref} — ${
      booking.service ? t(`services.items.${booking.service}.name`) : ''
    } · ${formatDate(booking.schedule.date, lang)} ${booking.schedule.time}`,
  )
  const summary = [
    booking.service && t(`services.items.${booking.service}.name`),
    booking.pet.name,
    `${formatDate(booking.schedule.date, lang)} · ${booking.schedule.time}`,
  ].filter(Boolean)

  return (
    <div className="bk-success">
      <div className="bk-success__burst">
        <CheckCircle2 size={56} />
        <span className="bk-success__ring" aria-hidden="true" />
        <span className="bk-success__ring bk-success__ring--2" aria-hidden="true" />
      </div>
      <h2 className="bk-success__title">{t('booking.success.title')}</h2>
      <p className="bk-success__sub">{t('booking.success.sub')}</p>

      <div className="bk-success__ref">
        <small>{t('booking.success.ref')}</small>
        <strong>{booking.ref}</strong>
      </div>

      <div className="bk-success__summary">
        <span className="bk-success__summary-head">{t('booking.success.summary')}</span>
        <ul>
          {summary.map((s, i) => (
            <li key={i}>
              <PawPrint size={14} /> {s}
            </li>
          ))}
        </ul>
      </div>

      <p className="bk-success__demo">
        <Info size={14} /> {t('booking.demoBanner')}
      </p>

      <div className="bk-success__actions">
        <a
          className="btn btn--whatsapp"
          href={`${CLINIC.whatsapp}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} /> {t('booking.success.whatsapp')}
        </a>
        <button className="btn btn--ghost" onClick={onClose}>
          <Home size={18} /> {t('booking.success.home')}
        </button>
      </div>
    </div>
  )
}
