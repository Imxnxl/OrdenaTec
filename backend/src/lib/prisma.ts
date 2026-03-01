// ============================================
// OrdenaTEC — Prisma Client Singleton
// Single shared instance to avoid exhausting
// database connection pools.
// ============================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
