import { PrismaClient } from "@prisma/client"
import { CATEGORY_TAXONOMY } from "./categoryTaxonomy"

const prisma = new PrismaClient()

async function main() {
  let sortOrder = 0
  for (const main of CATEGORY_TAXONOMY) {
    const parent = await prisma.category.upsert({
      where: { slug: main.slug },
      update: { nameEn: main.nameEn, nameAr: main.nameAr, icon: main.icon, sortOrder: sortOrder },
      create: {
        slug: main.slug,
        nameEn: main.nameEn,
        nameAr: main.nameAr,
        icon: main.icon,
        sortOrder: sortOrder,
      },
    })
    sortOrder++

    let subOrder = 0
    for (const sub of main.children) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { nameEn: sub.nameEn, nameAr: sub.nameAr, parentId: parent.id, sortOrder: subOrder },
        create: {
          slug: sub.slug,
          nameEn: sub.nameEn,
          nameAr: sub.nameAr,
          parentId: parent.id,
          sortOrder: subOrder,
        },
      })
      subOrder++
    }
    console.log(`Seeded ${main.nameEn} + ${main.children.length} subcategories`)
  }
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
