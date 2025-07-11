import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 10)

  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        username: 'Admin',
        email: 'admin@example.com',
        password,
        role: 'admin'
      }
    })

    console.log('✅ Admin user created.')
  } else {
    console.log('⚠️ Admin user already exists.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
