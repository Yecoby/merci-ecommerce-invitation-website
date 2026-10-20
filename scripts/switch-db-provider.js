#!/usr/bin/env node

/**
 * MERCI Platform — Production Database Migration Utility
 *
 * This script documents and validates switching the Prisma schema datasource
 * between local SQLite (dev) and managed PostgreSQL (production).
 *
 * Usage:
 *   node scripts/switch-db-provider.js postgresql
 *   node scripts/switch-db-provider.js sqlite
 */

const fs = require("fs");
const path = require("path");

const targetProvider = process.argv[2];

if (!targetProvider || !["sqlite", "postgresql"].includes(targetProvider)) {
  console.log("Usage: node scripts/switch-db-provider.js [sqlite|postgresql]");
  process.exit(1);
}

const schemaPath = path.resolve(__dirname, "../prisma/schema.prisma");
let content = fs.readFileSync(schemaPath, "utf-8");

if (targetProvider === "postgresql") {
  content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  console.log("Updated prisma/schema.prisma datasource provider to: postgresql");
  console.log("Next steps for PostgreSQL deployment:");
  console.log("  1. Configure DATABASE_URL='postgresql://user:password@host:5432/dbname?schema=public'");
  console.log("  2. Run: npx prisma migrate deploy");
  console.log("  3. Run: npx prisma generate");
} else {
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  console.log("Updated prisma/schema.prisma datasource provider to: sqlite");
  console.log("Next steps for SQLite development:");
  console.log("  1. Ensure DATABASE_URL='file:./dev.db'");
  console.log("  2. Run: npx prisma db push");
  console.log("  3. Run: npx prisma generate");
}

fs.writeFileSync(schemaPath, content, "utf-8");
