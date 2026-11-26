import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@fivepaws.sa"
  const password = process.env.SEED_ADMIN_PASSWORD || "FivePaws@2026"
  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name: "Store Admin" },
  })

  console.log(`Admin user ready: ${email} / ${password} (change this password after first login)`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
