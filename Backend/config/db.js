const mysql = require("mysql2");
require("dotenv").config(); // Load .env variables
const url = require("url");

const dbUrl = new URL(process.env.DATABASE_URL);

const db = mysql.createConnection({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  ssl: {
    rejectUnauthorized: true, 
  },
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

module.exports = db;

