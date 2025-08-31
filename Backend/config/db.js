const mysql = require("mysql2");
require("dotenv").config(); 
const url = require("url");

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

module.exports = db;
