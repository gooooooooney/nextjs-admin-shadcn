import bcrypt from "bcryptjs";
import { db } from "../db"
import { UserRole } from "@prisma/client";

const runSuperAdmin = async () => {
  const user = await db.user.findFirst({
    where: {
      email: process.env.SUPER_ADMIN_EMAIL
    }
  })

  if (!user) {
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD!, 10);

    console.log("⏳ Running seed...")

    const start = Date.now()



    await db.user.create({
      data: {
        id: process.env.SUPER_ADMIN_UUID,
        name: "super admin",
        email: process.env.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        emailVerified: new Date(),
        role: {
          create: {
            userRole: UserRole.superAdmin,
            superAdmin: true,
            name: "Super Admin",
          }
        }
      },
    });
    const end = Date.now()

    console.log(`✅ Seed runSuperAdmin completed in ${end - start}ms`)

  }
}

const runAdmin = async () => {

  const user = await db.user.findFirst({
    where: {
      email: "admin@test.com"
    }
  })
  if (!user) {
    console.log("⏳ Running seed...")

    const start = Date.now()

    await db.user.create({
      data: {
        name: "admin",
        email: "admin@test.com",
        password: await bcrypt.hash("admin1234", 10),
        emailVerified: new Date(),
        role: {
          create: {
            userRole: UserRole.admin,
            name: "Admin",
          },
        },
        createdBy: {
          connect: {
            email:  process.env.SUPER_ADMIN_EMAIL,
            id:  process.env.SUPER_ADMIN_UUID,
          }
        }
      }
    })
    const end = Date.now()

    console.log(`✅ Seed runAdmin completed in ${end - start}ms`)

    process.exit(0)
  }

}

runSuperAdmin().then(() => {
  runAdmin().catch((err) => {
    console.error("❌ Seed runAdmin failed")
    console.error(err)
    process.exit(1)
  })
}).catch((err) => {
  console.error("❌ Seed runSuperAdmin failed")
  console.error(err)
  process.exit(1)
})

