import mysql from "mysql2/promise";

/**
 * A single shared connection pool for the whole app. Next.js can call route
 * handlers many times in dev (hot reload) — stashing the pool on `global`
 * avoids creating a new pool (and exhausting MySQL's connection limit) on
 * every reload, the same pattern commonly used for Prisma clients.
 */
declare global {
  var _rituuPool: mysql.Pool | undefined;
}

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "rituu_bhatia",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    dateStrings: true, // return DATE/DATETIME columns as plain strings, not JS Date objects
  });
}

export const pool = global._rituuPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  global._rituuPool = pool;
}

/**
 * Thin query helper. Always use parameterized queries (the `?` placeholders)
 * — never string-interpolate user input into SQL, which is how SQL
 * injection happens.
 */
export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<T> {
  const [rows] = await pool.query(sql, params);
  return rows as T;
}
