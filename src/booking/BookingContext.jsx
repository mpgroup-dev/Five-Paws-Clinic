import { createContext, useContext, useState, useCallback } from 'react'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  // optional service key to preselect when opening from a service card
  const [preselect, setPreselect] = useState(null)

  const openBooking = useCallback((serviceKey = null) => {
    setPreselect(serviceKey)
    setIsOpen(true)
  }, [])

  const closeBooking = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <BookingContext.Provider
      value={{ isOpen, preselect, openBooking, closeBooking }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
