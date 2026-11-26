import { customAlphabet } from "nanoid"

const numeric = customAlphabet("0123456789", 6)
const trackingAlphabet = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 16) // no 0/O/1/I ambiguity

export function generateOrderNumber(): string {
  return `FPS-${numeric()}`
}

export function generateTrackingToken(): string {
  return trackingAlphabet()
}
