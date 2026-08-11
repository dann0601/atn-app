import path from 'node:path';
import { config } from 'dotenv';
import { PrismaClient, UserRole } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

config({
  path: path.resolve(__dirname, '../../.env'),
});

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env['DATABASE_URL'],
  }),
});

async function main() {
  const name = process.env['SUPER_ADMIN_NAME'];
  const email = process.env['SUPER_ADMIN_EMAIL'];
  const password = process.env['SUPER_ADMIN_PASSWORD'];

  if (!name || !email || !password) {
    throw new Error('Missing super admin environment variables');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name,
      passwordHash,
      role: UserRole.super_admin,
    },
    create: {
      name,
      email,
      passwordHash,
      role: UserRole.super_admin,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });