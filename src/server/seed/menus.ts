import { db } from "@/drizzle/db"
import { menuTable, userMenuTable } from "@/drizzle/schema"

const superAdminId = process.env.SUPER_ADMIN_UUID as string
const menus = [
  {
    path: '/',
    label: "Dashboard",
    icon: "Home",
    parentId: null,
    status: "active",
    createBy: superAdminId,
    type: 'menu',
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: "Package",
    parentId: null,
    status: "active",
    createBy: superAdminId,
    type: 'menu',
  },
  {
    path: '/settings',
    label: 'settings',
    icon: "Settings",
    parentId: null,
    status: "active",
    createBy: superAdminId,
    type: 'menu',
  },
  {
    path: '/system',
    label: 'system',
    icon: "Package",
    parentId: null,
    status: "active",
    createBy: superAdminId,
    type: 'dir',
    children: [
      {
        path: '/system/users',
        label: "System Users",
        icon: "Users",
      },
      {
        path: '/system/menus',
        label: "System Menus",
        icon: "Menu",
      }
    ],
  },
  {
    path: "/error",
    label: "error pages",
    icon: "AlertCircle",
    parentId: null,
    status: "active",
    createBy: superAdminId,
    type: 'dir',
    children: [
      {
        path: "/error/404",
        label: "404",
        icon: "AlertTriangle",
        status: "active",
        createBy: superAdminId,
        type: 'menu',
      },
      {
        path: "/error/500",
        label: "500",
        icon: "ShieldAlert",
        status: "active",
        createBy: superAdminId,
        type: 'menu',
      },
    ],
  }
]

async function runSeed() {
  console.log("⏳ Running menus seed...")

 await db.transaction(async (tx) => {
  const start = Date.now()

  const result = await tx.insert(menuTable).values(menus as any).returning()

  if (result.length) {
    const childrenMenus = menus.filter((menu) => menu.type === 'dir').map((menu) => {
      const parent = result.find((m) => m.path === menu.path)

      return menu.children?.map((child) => ({
        ...child,
        parentId: parent?.id,
        createBy: superAdminId,
        type: 'menu',
      }))
    })
    const resultMenus = await tx.insert(menuTable).values(childrenMenus.flat() as any).returning()

    await tx.insert(userMenuTable).values([...resultMenus, ...result].map((menu) => ({
      userId: superAdminId,
      menuId: menu.id,
    })))
  }
  const end = Date.now()

  console.log(`✅ Seed completed in ${end - start}ms`)
 })

  process.exit(0)
}

runSeed().catch((err) => {
  console.error("❌ Seed failed")
  console.error(err)
  process.exit(1)
})
