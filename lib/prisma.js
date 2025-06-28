import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Use a symbol to avoid accidental property clashes
const prismaKey = Symbol.for("prisma");

if (!globalForPrisma[prismaKey]) {
  globalForPrisma[prismaKey] = new PrismaClient();
}

export const db = globalForPrisma[prismaKey];
