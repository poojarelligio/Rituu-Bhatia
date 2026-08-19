/**
 * Usage: node scripts/create-admin.mjs "Rituu Bhatia" admin@rituubhatia.in yourpassword
 * Reads DB connection info from .env.local (via dotenv).
 */
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" });

const [, , name, email, password] = process.argv;

if (!name || !email || !password) {
  console.error('Usage: node scripts/create-admin.mjs "Full Name" email@example.com yourpassword');
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "rituu",
});

const passwordHash = await bcrypt.hash(password, 12);

await pool.query(
  "INSERT INTO admin_users (name, email, password_hash) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = VALUES(name)",
  [name, email, passwordHash]
);

console.log(`Admin user ready: ${email}`);
await pool.end();
