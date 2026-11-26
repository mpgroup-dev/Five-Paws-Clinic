import { z } from "zod"

// Saudi mobile numbers: 05XXXXXXXX (10 digits) or +9665XXXXXXXX / 9665XXXXXXXX
export const saudiMobileRegex = /^(?:\+?966|0)5\d{8}$/

export function normalizeSaudiMobile(input: string): string {
  const digits = input.replace(/[^\d+]/g, "")
  if (digits.startsWith("+966")) return "0" + digits.slice(4)
  if (digits.startsWith("966")) return "0" + digits.slice(3)
  return digits
}

export const guestCheckoutSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is too short"),
  mobile: z
    .string()
    .trim()
    .refine((v) => saudiMobileRegex.test(v), "Invalid Saudi mobile number"),
  email: z.string().trim().email().optional().or(z.literal("")),
  city: z.string().trim().min(2),
  district: z.string().trim().min(2),
  street: z.string().trim().min(2),
  buildingNo: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
})

export type GuestCheckoutInput = z.infer<typeof guestCheckoutSchema>
