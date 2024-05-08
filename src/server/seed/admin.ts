import bcrypt from "bcryptjs";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserRole, menuTable, role, user, userMenuTable } from "@/drizzle/schema";

const runSuperAdmin = async () => {
  const userinfo = await db.query.user.findFirst({
    where: eq(user.email, process.env.SUPER_ADMIN_EMAIL!)
  })

  if (!userinfo) {
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD!, 10);

    console.log("⏳ Running seed...")

    const start = Date.now()

    await db.transaction(async (tx) => {
      const insertUserResult = await tx.insert(user).values({
        id: process.env.SUPER_ADMIN_UUID,
        name: "super admin",
        email: process.env.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        emailVerified: new Date(),
      }).returning({ userId: user.id });

      const userId = insertUserResult[0]?.userId
      if (!userId) return new Error('Failed to create superAdmin')

      await tx.insert(role).values({
        userRole: UserRole.Enum.superAdmin,
        userId,
        superAdmin: true,
      })
    })

    const end = Date.now()

    console.log(`✅ Seed runSuperAdmin completed in ${end - start}ms`)

  } else {
    console.log("✅ Super admin already exists")
  }
}

const runAdmin = async () => {

  await db.transaction(async (tx) => {
    const userinfo = await tx.query.user.findFirst({
      where: eq(user.email, "admin@test.com")
    })
    let uid = userinfo?.id
    if (!userinfo) {
      console.log("⏳ Running runAdmin seed...")

      const start = Date.now()
      const insertUserResult = await tx.insert(user).values({
        name: "admin",
        email: "admin@test.com",
        password: await bcrypt.hash("admin1234", 10),
        emailVerified: new Date(),
        createdById: process.env.SUPER_ADMIN_UUID,
      }).returning({ userId: user.id });

      const userId = insertUserResult[0]?.userId

      if (!userId) return new Error('Failed to create admin')
      uid = userId
      const roleResult = await tx.insert(role).values({
        userRole: UserRole.Enum.admin,
        name: "Admin",
        userId,
      }).returning({ roleId: role.id });

      if (!roleResult[0]) return new Error('Failed to create admin role')



      const end = Date.now()

      console.log(`✅ Seed runAdmin completed in ${end - start}ms`)
    }
    const menus = await tx.query.menuTable.findMany()

    const home = menus.find((m) => m.path === "/")


    home && await tx.insert(userMenuTable).values({
      userId: uid!,
      menuId: home!.id,
    })
  })
  process.exit(0)


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

