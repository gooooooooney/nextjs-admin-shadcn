import bcrypt from "bcryptjs";
import { db } from "../db"
import { env } from "@/env"
import { UserRole } from "@prisma/client";

const runSuperAdmin = async () => {
  const user = await db.user.findFirst({
    where: {
      email: env.SUPER_ADMIN_EMAIL
    }
  })

  if (!user) {
    const hashedPassword = await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, 10);

    console.log("⏳ Running seed...")

    const start = Date.now()



    await db.user.create({
      data: {
        name: "super admin",
        email: env.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        emailVerified: new Date(),
        role: {
          create: {
            userRole: UserRole.admin,
            superAdmin: true,
          }
        }
      },
    });
    const end = Date.now()

    console.log(`✅ Seed completed in ${end - start}ms`)

    process.exit(0)
  }
}

runSuperAdmin().catch((err) => {
  console.error("❌ Seed failed")
  console.error(err)
  process.exit(1)
})