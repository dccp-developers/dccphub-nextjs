import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

// Create a connection pool
const connectionString = process.env.DATABASE_URL;
const pool = globalForPrisma.pool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== "production") globalForPrisma.pool = pool;

// Create the adapter
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
