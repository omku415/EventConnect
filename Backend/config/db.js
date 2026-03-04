import mysql from "mysql2";
import dotenv from "dotenv";
import { URL } from "url";

dotenv.config();

const dbUrl = new URL(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  ssl: {
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();

// Test connection once
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("Connected to MySQL Database (via pool)");
    conn.release();
  } catch (err) {
    console.error("Database pool connection failed:", err);
  }
})();

export default db;