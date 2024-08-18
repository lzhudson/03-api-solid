import { randomUUID } from 'node:crypto';
import type { Environment } from 'vitest'
import 'dotenv/config';
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';

function generateDatabaseURL(schema: string) {
  if(!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString()
}

const prisma = new PrismaClient();

export default <Environment>{
  name: 'custom',
  transformMode: 'ssr',
  setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await prisma.$disconnect();
      }
    }
  }
}