// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'; // Import standard

console.log("DATABASE_URL IN USO:", process.env.DATABASE_URL);

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient();
};

export const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}