import { faker } from '@faker-js/faker';
import { UserRole } from '@prisma/client';
import { db } from '../db';

const fakeUsers = Array.from({ length: 30 }, (_, i) => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  emailVerified: new Date(),
  role: {
    create: {
      userRole: UserRole.user,
      superAdmin: false,
    },
  },
}));


const runCreateUsers = async () => {
  console.log('⏳ Running seed...');

  const start = Date.now();

  await Promise.all(
    fakeUsers.map((user) =>
      db.user.create({
        data: {
          ...user,
          createdBy: {
            connect: {
              email: "admin@test.com"
            }
          }
        },
      })
    )
  );

  const end = Date.now();

  console.log(`✅ Seed completed in ${end - start}ms`);

  process.exit(0);
}

runCreateUsers().catch((err) => {
  console.error('❌ Seed runCreateUsers failed');
  console.error(err);
  process.exit(1);
});