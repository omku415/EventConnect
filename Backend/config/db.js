const mysql = require("mysql2");
require("dotenv").config();

const dbUrl = new URL(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test connection immediately
pool.query("SELECT 1", (err) => {
  if (err) {
    console.error("❌ DB connection test failed:", err);
  } else {
    console.log("✅ DB connection successful");
  }
});

module.exports = pool.promise();
