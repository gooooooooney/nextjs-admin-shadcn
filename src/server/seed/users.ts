import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

let fakeUsers = Array.from({ length: 30 }, (_, i) => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  emailVerified: new Date(),
  // role: {
  //   create: {
  //     userRole: UserRole.user,
  //     superAdmin: false,
  //   },
  // },
}));


const runCreateUsers = async () => {
  console.log('⏳ Running seed...');

  const start = Date.now();

  await db.transaction(async (tx) => {
    const admin = await tx.query.user.findFirst({
      columns: {
        id: true
      },
      where: eq(user.email, 'admin@test.com')
    })

    if (!admin) return new Error('Admin not found');
    fakeUsers = fakeUsers.map((user) => ({
      ...user,
      createdById: admin.id
    }));
    await tx.insert(user).values(fakeUsers).execute();
  })


  const end = Date.now();

  console.log(`✅ Seed completed in ${end - start}ms`);

  process.exit(0);
}

runCreateUsers().catch((err) => {
  console.error('❌ Seed runCreateUsers failed');
  console.error(err);
  process.exit(1);
});