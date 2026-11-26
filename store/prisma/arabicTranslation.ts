// ============================================================
// English -> Arabic product-name generation.
//
// Approach (per the client's own instruction: "use accurate translations or
// Arabic transliterations of brand and product names where appropriate. Do
// not translate brand names incorrectly or remove original product identity."):
//   1. Detect the brand prefix (from the known brand list) and transliterate
//      it using a curated map of real, commonly-used Gulf/Saudi retail
//      transliterations (e.g. "Royal Canin" -> "رويال كانين"). Brands with no
//      well-established Arabic convention are kept in Latin script, which is
//      itself standard practice on Saudi marketplaces for less-known brands.
//   2. Translate the remaining descriptive words (flavors, life-stages,
//      product types) via a term dictionary built from the words that
//      actually occur across this catalog.
//   3. Anything left unmatched stays in English rather than being guessed —
//      safer than inventing a wrong Arabic word, and still readable.
// ============================================================

export const BRAND_AR: Record<string, string> = {
  "ROYAL CANIN": "رويال كانين",
  "HILLS": "هيلز",
  "HILL'S": "هيلز",
  "PD": "هيلز - بريسكريبشن دايت", // Hill's Prescription Diet code
  "PURINA PRO PLAN": "بيورينا برو بلان",
  "PURINA": "بيورينا",
  "N&D": "إن آند دي",
  "FARMINA": "فارمينا",
  "GOSBI": "جوسبي",
  "WOOLF": "وولف",
  "KITCAT": "كت كات",
  "KIT CAT": "كت كات",
  "LECHAT": "لو شا",
  "KANIVA": "كانيفا",
  "TRIXIE": "تريكسي",
  "NUNBELL": "نونبيل",
  "ZOLUX": "زولوكس",
  "CAVIARA": "كافيارا",
  "SANICAT": "سانيكات",
  "APPLAWS": "أبلوز",
  "WELLNESS CORE": "ويلنس كور",
  "WELLNESS": "ويلنس",
  "JOSERA": "جوسيرا",
  "ROYALIST": "رويالست",
  "ACANA": "أكانا",
  "BEAPHAR": "بيافار",
  "VETIQ": "فيت آي كيو",
  "VET IQ": "فيت آي كيو",
  "DR. ELSEY'S": "دكتور إلسيز",
  "VINCI": "فينشي",
  "VERSELE LAGA": "فيرسيلي لاجا",
  "VERSELE-LAGA": "فيرسيلي لاجا",
  "LOLO PETS": "لولو بيتس",
  "CLUB 4 PAWS": "كلوب 4 باوز",
  "SISO": "سيسو",
  "BUNDI": "بوندي",
  "GEMON": "جيمون",
  "NATURAL CODE": "ناتشورال كود",
  "LIFEDOG": "لايف دوج",
  "LIFE DOG": "لايف دوج",
  "NUEVO": "نويفو",
  "PRINCESS": "برينسيس",
  "VETERINARY FORMULA": "فيترنري فورمولا",
  "BIO PETACTIVE": "بايو بيت أكتيف",
  "BIO PET ACTIVE": "بايو بيت أكتيف",
  "NATSBI": "ناتسبي",
  "BTM": "بي تي إم",
}

// Sorted by length (longest first) so e.g. "ROYAL CANIN" is matched before "CANIN"
export const BRAND_KEYS_BY_LENGTH = Object.keys(BRAND_AR).sort((a, b) => b.length - a.length)

export const TERM_AR: Record<string, string> = {
  // life stage / purpose
  KITTEN: "للقطط الصغيرة",
  PUPPY: "للجراء",
  ADULT: "للبالغين",
  SENIOR: "لكبار السن",
  MOTHER: "للأمهات",
  BABYCAT: "وصغارها",
  "BABY CAT": "وصغارها",
  STERILISED: "للمعقمة",
  STERILIZED: "للمعقمة",
  INDOOR: "للمنزل",
  OUTDOOR: "للخارج",

  // product type / packaging
  "DRY FOOD": "طعام جاف",
  "WET FOOD": "طعام رطب",
  POUCH: "كيس",
  CANNED: "معلب",
  CAN: "معلب",
  PATE: "باتيه",
  MOUSSE: "موس",
  LOAF: "لواف",
  GRAVY: "مرق",
  JELLY: "جيلي",
  TREAT: "مكافأة",
  TREATS: "مكافآت",
  SNACK: "وجبة خفيفة",
  MILK: "حليب",
  SHAMPOO: "شامبو",
  SPRAY: "بخاخ",
  LITTER: "رمل",
  "LITTER BOX": "صندوق رمل",
  TOY: "لعبة",
  BRUSH: "فرشاة",
  COMB: "مشط",
  LEASH: "مقود",
  HARNESS: "طوق",
  CARRIER: "حقيبة نقل",
  BED: "سرير",

  // care / health
  CARE: "عناية",
  DIGESTIVE: "الهضم",
  URINARY: "المسالك البولية",
  RENAL: "الكلى",
  HAIRBALL: "كرات الشعر",
  "HAIR AND SKIN": "الشعر والجلد",
  "HAIR & SKIN": "الشعر والجلد",
  DENTAL: "الأسنان",
  HYPOALLERGENIC: "لمضاد الحساسية",
  GASTROINTESTINAL: "الجهاز الهضمي",
  GASTRO: "الجهاز الهضمي",

  // flavors
  CHICKEN: "دجاج",
  BEEF: "لحم بقري",
  LAMB: "لحم غنم",
  DUCK: "بط",
  TURKEY: "ديك رومي",
  SALMON: "سلمون",
  TUNA: "تونة",
  FISH: "سمك",
  WHITEFISH: "سمك أبيض",
  SHRIMP: "جمبري",
  LIVER: "كبدة",
  RABBIT: "أرنب",
  GOOSE: "إوز",
  VEAL: "لحم عجل",

  // sizes/misc words often in names
  MINI: "صغير الحجم",
  MAXI: "كبير الحجم",
  LARGE: "كبير",
  SMALL: "صغير",
  "LONG HAIR": "طويل الشعر",
  LONGHAIR: "طويل الشعر",
  PERSIAN: "شيرازي",
}

// Longest-first so multi-word phrases translate before their sub-words do
export const TERM_KEYS_BY_LENGTH = Object.keys(TERM_AR).sort((a, b) => b.length - a.length)

/**
 * Best-effort EN -> AR product name generator.
 * Never fabricates meaning: untranslated tokens are left in Latin script
 * rather than guessed, so the result is always traceable back to the source.
 */
export function generateArabicName(englishName: string): string {
  let working = " " + englishName.toUpperCase() + " "
  let arabicBrand = ""

  for (const brandKey of BRAND_KEYS_BY_LENGTH) {
    const pattern = new RegExp(`\\b${brandKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
    if (pattern.test(working)) {
      arabicBrand = BRAND_AR[brandKey]
      working = working.replace(pattern, " ")
      break
    }
  }

  for (const termKey of TERM_KEYS_BY_LENGTH) {
    const pattern = new RegExp(`\\b${termKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g")
    working = working.replace(pattern, ` ${TERM_AR[termKey]} `)
  }

  const rest = working.replace(/\s+/g, " ").trim()
  const parts = [arabicBrand, rest].filter(Boolean)
  return parts.join(" ") || englishName
}
