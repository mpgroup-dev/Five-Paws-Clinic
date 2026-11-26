// ============================================================
// Imports the client's product catalog (already matched/classified in the
// Five Paws Clinic catalog-organization pass) into the store database.
//
// Source of truth: Products-Organized/final_catalog.xlsx ("Final Catalog" sheet)
// Images:          Products-Organized/<Category>/<Subcategory>/*.jpg (+ Needs-Review)
// ============================================================
import { PrismaClient, AnimalType, ProductStatus } from "@prisma/client"
import ExcelJS from "exceljs"
import fs from "node:fs"
import path from "node:path"
import { generateArabicName } from "./arabicTranslation"
import { CATEGORY_TAXONOMY } from "./categoryTaxonomy"

const prisma = new PrismaClient()

const CATALOG_DIR = path.resolve(
  "D:/MP Group Tech Dev/Cutomers/Five Paws Clinic/images/Products-Organized",
)
const CATALOG_XLSX = path.join(CATALOG_DIR, "final_catalog.xlsx")
const PUBLIC_PRODUCTS_DIR = path.resolve(process.cwd(), "public/products")

// -- category slug lookup: ("Main Category","Subcategory") -> slug ---------
const subSlugByNames = new Map<string, string>()
const mainSlugByName = new Map<string, string>()
for (const main of CATEGORY_TAXONOMY) {
  mainSlugByName.set(main.nameEn, main.slug)
  for (const sub of main.children) {
    subSlugByNames.set(`${main.nameEn}::${sub.nameEn}`, sub.slug)
  }
}

// -- animal type mapping -----------------------------------------------------
function mapAnimalType(raw: string | null | undefined, originalSection: string | null): AnimalType {
  const v = (raw || "").toLowerCase()
  if (v === "cat") return AnimalType.CAT
  if (v === "dog") return AnimalType.DOG
  if (v === "bird") return AnimalType.BIRD
  if (v === "fish") return AnimalType.FISH
  if (v === "turtle") return AnimalType.TURTLE
  if (v === "small_pet") return AnimalType.SMALL_PET
  if (v.includes("multi") || v.includes("other")) return AnimalType.OTHER
  // fall back to what the Excel section said, when the image gave us nothing
  const sec = (originalSection || "").toLowerCase()
  if (sec.includes("cat food") && sec.includes("dog food")) return AnimalType.CAT_AND_DOG
  if (sec.includes("cat")) return AnimalType.CAT
  if (sec.includes("dog")) return AnimalType.DOG
  return AnimalType.UNSPECIFIED
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function shortDescription(args: {
  nameEn: string
  brand: string | null
  mainCategory: string | null
  subCategory: string | null
  animalType: AnimalType
}): { en: string; ar: string } {
  const animalEnMap: Record<string, string> = {
    CAT: "cats",
    DOG: "dogs",
    CAT_AND_DOG: "cats and dogs",
    BIRD: "birds",
    FISH: "fish",
    TURTLE: "turtles",
    SMALL_PET: "small pets",
    OTHER: "pets",
    UNSPECIFIED: "pets",
  }
  const animalArMap: Record<string, string> = {
    CAT: "القطط",
    DOG: "الكلاب",
    CAT_AND_DOG: "القطط والكلاب",
    BIRD: "الطيور",
    FISH: "الأسماك",
    TURTLE: "السلاحف",
    SMALL_PET: "الحيوانات الصغيرة",
    OTHER: "الحيوانات الأليفة",
    UNSPECIFIED: "الحيوانات الأليفة",
  }
  const brandPart = args.brand ? `by ${args.brand}` : ""
  const catPart = args.subCategory || args.mainCategory || "pet care"
  const en = `${args.nameEn} — a ${catPart.toLowerCase()} product ${brandPart} for ${animalEnMap[args.animalType]}.`.replace(/\s+/g, " ").trim()
  const ar = `${generateArabicName(args.nameEn)} — منتج ${catPart} ${args.brand ? "من " + args.brand : ""} مخصص لـ${animalArMap[args.animalType]}.`.replace(/\s+/g, " ").trim()
  return { en, ar }
}

async function findImageFile(filename: string | null): Promise<string | null> {
  if (!filename) return null
  // the organized images live under Category/Subcategory/, or Needs-Review/
  const found = await walkFind(CATALOG_DIR, filename)
  return found
}

async function walkFind(dir: string, filename: string): Promise<string | null> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const found = await walkFind(full, filename)
      if (found) return found
    } else if (entry.name === filename) {
      return full
    }
  }
  return null
}

async function main() {
  await fs.promises.mkdir(PUBLIC_PRODUCTS_DIR, { recursive: true })

  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(CATALOG_XLSX)
  const ws = wb.getWorksheet("Final Catalog")
  if (!ws) throw new Error("Final Catalog sheet not found")

  const headerRow = ws.getRow(1).values as unknown[]
  const headers = headerRow.map((h) => (typeof h === "string" ? h.trim() : h))
  const col = (name: string) => headers.indexOf(name)

  type Row = {
    order: number
    name: string
    brand: string | null
    mainCategory: string | null
    subCategory: string | null
    animalType: string | null
    size: string | null
    price: number | null
    imageFilename: string | null
    status: string
    originalSection: string | null
  }

  const rows: Row[] = []
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    const get = (name: string) => row.getCell(col(name)).value
    const status = String(get("Matching Status") || "")
    if (status.startsWith("Duplicate")) return // literal duplicates are merged already

    rows.push({
      order: Number(get("Order")),
      name: String(get("Product Name") || "").trim(),
      brand: get("Brand") ? String(get("Brand")).trim() : null,
      mainCategory: get("Main Category") ? String(get("Main Category")).trim() : null,
      subCategory: get("Subcategory") ? String(get("Subcategory")).trim() : null,
      animalType: get("Animal Type") ? String(get("Animal Type")).trim() : null,
      size: get("Size") ? String(get("Size")).trim() : null,
      price:
        typeof get("Price") === "number"
          ? (get("Price") as number)
          : get("Price")
            ? Number(get("Price"))
            : null,
      imageFilename: get("Image Filename") ? String(get("Image Filename")).trim() : null,
      status,
      originalSection: get("Original Section") ? String(get("Original Section")).trim() : null,
    })
  })

  console.log(`Read ${rows.length} non-duplicate rows from the catalog.`)

  // group variants by exact product name (same convention as the earlier
  // catalog-organization matching pass)
  const groups = new Map<string, Row[]>()
  for (const r of rows) {
    const key = r.name.toUpperCase().replace(/\s+/g, " ").trim()
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(r)
  }

  let created = 0
  let draftCount = 0
  const usedSlugs = new Set<string>()
  const usedSkus = new Set<string>()

  for (const [, groupRows] of groups) {
    const first = groupRows[0]
    const brandName = groupRows.find((r) => r.brand)?.brand ?? null
    const mainCategory = groupRows.find((r) => r.mainCategory)?.mainCategory ?? null
    const subCategory = groupRows.find((r) => r.subCategory)?.subCategory ?? null
    const animalTypeRaw = groupRows.find((r) => r.animalType)?.animalType ?? null
    const animalType = mapAnimalType(animalTypeRaw, first.originalSection)
    const imageFilename = groupRows.find((r) => r.imageFilename)?.imageFilename ?? null

    // resolve category id
    let categoryId: string | null = null
    if (mainCategory && subCategory) {
      const slug = subSlugByNames.get(`${mainCategory}::${subCategory}`)
      if (slug) {
        const cat = await prisma.category.findUnique({ where: { slug } })
        categoryId = cat?.id ?? null
      }
    } else if (mainCategory) {
      const slug = mainSlugByName.get(mainCategory)
      if (slug) {
        const cat = await prisma.category.findUnique({ where: { slug } })
        categoryId = cat?.id ?? null
      }
    }

    // resolve / copy image
    let imageUrl: string | null = null
    if (imageFilename) {
      const srcPath = await findImageFile(imageFilename)
      if (srcPath) {
        const destName = imageFilename
        const destPath = path.join(PUBLIC_PRODUCTS_DIR, destName)
        await fs.promises.copyFile(srcPath, destPath)
        imageUrl = `/products/${destName}`
      }
    }

    // brand
    let brandId: string | null = null
    if (brandName) {
      const brand = await prisma.brand.upsert({
        where: { name: brandName },
        update: {},
        create: { name: brandName },
      })
      brandId = brand.id
    }

    // decide status + review note
    const reasons: string[] = []
    if (!imageUrl) reasons.push("missing product image")
    if (!categoryId) reasons.push("category not resolved")
    if (animalType === AnimalType.UNSPECIFIED) reasons.push("animal type not confirmed")
    const hasPrice = groupRows.some((r) => r.price !== null && !Number.isNaN(r.price))
    if (!hasPrice) reasons.push("price missing in source data")

    const status = reasons.length === 0 ? ProductStatus.ACTIVE : ProductStatus.DRAFT
    if (status === ProductStatus.DRAFT) draftCount++

    // slug (unique)
    let slug = slugify(first.name)
    if (usedSlugs.has(slug)) slug = `${slug}-${first.order}`
    usedSlugs.add(slug)

    const nameAr = generateArabicName(first.name)
    const desc = shortDescription({
      nameEn: first.name,
      brand: brandName,
      mainCategory,
      subCategory,
      animalType,
    })

    const product = await prisma.product.create({
      data: {
        sourceOrder: first.order,
        nameEn: first.name,
        nameAr,
        slug,
        descriptionEn: desc.en,
        descriptionAr: desc.ar,
        brandId,
        categoryId,
        animalType,
        status,
        needsReview: reasons.length > 0,
        reviewNote: reasons.length > 0 ? reasons.join("; ") : null,
        isNewArrival: true,
        images: imageUrl ? { create: [{ url: imageUrl, sortOrder: 0 }] } : undefined,
      },
    })

    for (const r of groupRows) {
      let sku = `${slug}-${r.size ? slugify(r.size) : "std"}`.toUpperCase()
      if (usedSkus.has(sku)) sku = `${sku}-${r.order}`
      usedSkus.add(sku)

      await prisma.productVariant.create({
        data: {
          productId: product.id,
          size: r.size,
          sku,
          priceSar: r.price ?? 0,
          stock: status === ProductStatus.ACTIVE ? 50 : 0, // placeholder stock, admin-editable
          isDefault: groupRows.indexOf(r) === 0,
        },
      })
    }

    created++
    if (created % 50 === 0) console.log(`...${created} products imported`)
  }

  console.log(`\nDone. Created ${created} products (${draftCount} marked DRAFT / needs review).`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
