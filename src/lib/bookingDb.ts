import mysql from "mysql2/promise";

/**
 * If your project already has a shared mysql2 pool (e.g. src/lib/db.ts),
 * delete this file and import that pool in booking.ts instead.
 * IMPORTANT: the pool must use timezone "Z" so DATETIME values are read/written as UTC.
 */
const g = globalThis as unknown as { __bookingPool?: mysql.Pool };

export const pool =
  g.__bookingPool ??
  (g.__bookingPool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 8,
    timezone: "Z",
  }));
