// Real clinic information (provided by the client).
export const CLINIC = {
  name: 'Five Paws Clinic',
  phoneDisplay: '+996 579 775 665',
  phoneRaw: '+996579775665',
  whatsapp: 'https://wa.me/996579775665',
  location: 'Dammam, Saudi Arabia',
  maps: 'https://maps.app.goo.gl/uV2oCoDVGCctsU5W9?g_st=atm',
  facebook: 'https://www.facebook.com/share/1HujbEixfa/',
  rating: 4.8,
  ratingMax: 5,
}

// Service definitions. Icon = lucide-react component name. i18n key = translations.services.items.<key>
export const SERVICES = [
  { key: 'consultation', icon: 'Stethoscope' },
  { key: 'vaccination', icon: 'Syringe' },
  { key: 'grooming', icon: 'Scissors' },
  { key: 'dental', icon: 'Smile' },
  { key: 'checkup', icon: 'HeartPulse' },
  { key: 'preventive', icon: 'ShieldCheck' },
]

export const WHY = [
  { key: 'compassion', icon: 'HeartHandshake' },
  { key: 'friendly', icon: 'Home' },
  { key: 'personal', icon: 'Sparkles' },
  { key: 'booking', icon: 'CalendarCheck' },
]

// All 18 provided images, used in the gallery grid.
// `span` lets a few images take a larger cell for a premium mosaic layout.
export const GALLERY = [
  { src: '/images/image2.jpg', span: 'tall' },
  { src: '/images/image5.jpg', span: 'wide' },
  { src: '/images/image13.jpg', span: '' },
  { src: '/images/image7.jpg', span: 'tall' },
  { src: '/images/image6.jpg', span: '' },
  { src: '/images/image17.jpg', span: 'wide' },
  { src: '/images/image3.jpg', span: '' },
  { src: '/images/image1.jpg', span: 'wide' },
  { src: '/images/image18.jpg', span: 'tall' },
  { src: '/images/image8.jpg', span: '' },
  { src: '/images/image9.jpg', span: 'tall' },
  { src: '/images/image16.jpg', span: '' },
  { src: '/images/image12.jpg', span: '' },
  { src: '/images/image4.jpg', span: 'wide' },
  { src: '/images/image14.jpg', span: '' },
  { src: '/images/image11.jpg', span: '' },
  { src: '/images/image10.jpg', span: '' },
  { src: '/images/image15.jpg', span: '' },
]

export const HERO_IMG = '/images/image18.jpg'
export const HERO_IMG_SM = '/images/image13.jpg'

export const ABOUT_IMGS = {
  main: '/images/image5.jpg',
  tl: '/images/image7.jpg',
  br: '/images/image1.jpg',
}

export const CONTACT_IMG = '/images/image2.jpg'
export const WHY_IMG = '/images/image9.jpg'

export const LOGO = '/logo.png'
export const LOGO_MARK = '/logo-mark.png'

// The Five Paws online store (separate app). Falls back to the local dev
// This is the old, pre-merge copy of the clinic site (kept only as a
// reference) — the live site now lives in ../../store, which already
// points this at the merged app instead of a separate localhost URL.
export const STORE_URL = import.meta.env.VITE_STORE_URL || '/en/products'
