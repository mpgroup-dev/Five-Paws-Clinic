# Five Paws Clinic — Website

A premium, fully responsive **frontend demo** for Five Paws Veterinary Clinic (Dammam, Saudi Arabia), built with **React + Vite**. It includes a complete, interactive multi-step appointment booking experience. There is **no backend, database, admin dashboard, or authentication** — all booking data is stored locally in the browser (`localStorage`) for demonstration only.

## Highlights

- **Premium design system** — soft cream backgrounds, deep teal brand color, warm beige & gold accents, rounded cards, soft shadows, elegant typography (Fraunces + Plus Jakarta Sans; Cairo for Arabic).
- **Uses the real clinic photos** — all 18 provided images (`images/image1`–`image18`) appear in the gallery, with selected shots reused in the hero, about, why-choose-us, and contact sections. The official logo is used in the navbar and footer.
- **Complete booking system** — 6 guided steps (Service → Pet → Owner → Schedule → Notes → Review) plus an animated success screen with a booking reference. Includes field validation, phone/email validation, past-date prevention, simulated time slots, and same-session double-booking prevention. Bookings are saved to `localStorage`.
- **Gallery lightbox** — click to expand, next/previous navigation, keyboard support (arrows, `Esc`), image counter.
- **Bilingual & RTL-ready** — English-first, with a working English/Arabic toggle that flips the entire layout to RTL and uses logical CSS properties throughout. Language choice persists.
- **Accessible & smooth** — semantic HTML, focus management, keyboard navigation, scroll-reveal animations, and full `prefers-reduced-motion` support.

> **Demo notice:** Bookings are not sent to the clinic. Opening hours, veterinarian names, and some services are clearly labeled editable demo content and were not invented as facts. Visitors are directed to WhatsApp/phone to confirm real availability.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
images/                     Original source assets (as provided)
public/
  images/                   Served gallery/section images (image1–image18)
  logo.png                  Official logo (converted from logo.jfif)
  logo-mark.png             Transparent logo variant (used on dark footer)
src/
  components/               UI sections (Navbar, Hero, About, Services, …)
    booking/BookingModal.jsx  Multi-step booking flow
  booking/                  Booking context + data/validation helpers
  data/site.js              Clinic info, services, gallery mapping
  i18n/                     Language context + EN/AR translations
  hooks/useScrollReveal.js  Scroll-reveal animations
  styles/                   Design-system CSS (tokens, layout, sections, booking)
```

## Clinic information used

- **Name:** Five Paws Clinic
- **Phone / WhatsApp:** +996 579 775 665 · https://wa.me/996579775665
- **Location:** Dammam, Saudi Arabia · [Google Maps](https://maps.app.goo.gl/uV2oCoDVGCctsU5W9?g_st=atm)
- **Facebook:** https://www.facebook.com/share/1HujbEixfa/
- **Google Rating:** 4.8 / 5

## Editing demo content

- Services: `src/data/site.js` + text in `src/i18n/translations.js`
- Time slots: `src/booking/bookingData.js` (`TIME_SLOTS`)
- Colors / typography: CSS tokens in `src/styles/index.css`
- All copy (EN + AR): `src/i18n/translations.js`
