import { dictionaries, type Locale, locales, defaultLocale } from "./dictionaries"

export function getDictionary(locale: string) {
  const safe: Locale = (locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : defaultLocale
  return dictionaries[safe]
}

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale)
}
