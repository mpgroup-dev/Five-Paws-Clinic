"use client"

import { LanguageProvider } from "./i18n/LanguageContext.jsx"
import { BookingProvider } from "./booking/BookingContext.jsx"
import { useScrollReveal } from "./hooks/useScrollReveal.js"
import Navbar from "./components/Navbar.jsx"
import Hero from "./components/Hero.jsx"
import About from "./components/About.jsx"
import Services from "./components/Services.jsx"
import WhyChooseUs from "./components/WhyChooseUs.jsx"
import Gallery from "./components/Gallery.jsx"
import Reviews from "./components/Reviews.jsx"
import Contact from "./components/Contact.jsx"
import Footer from "./components/Footer.jsx"
import BookingModal from "./components/booking/BookingModal.jsx"

function ClinicHome() {
  useScrollReveal()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <BookingModal />
    </>
  )
}

export default function ClinicApp() {
  return (
    <LanguageProvider>
      <BookingProvider>
        <ClinicHome />
      </BookingProvider>
    </LanguageProvider>
  )
}
