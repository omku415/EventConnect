const mysql = require("mysql2");
require("dotenv").config();

const dbUrl = new URL(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host: dbUrl.hostname,                     // maglev.proxy.rlwy.net
  user: dbUrl.username,                     // root
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),// railway
  port: dbUrl.port,                         // 26000
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: true },        // ✅ may be required
});

pool.query("SELECT 1", (err) => {
  if (err) {
    console.error("❌ DB connection test failed:", err);
  } else {
    console.log("✅ DB connection successful");
  }
});

module.exports = pool.promise();
