require("dotenv").config(); // Load environment variables
const mysql = require("mysql2/promise");

async function initDB(req, res) {
  let rootConn;
  try {
    // 1️⃣ Connect to MySQL as root (for setup)
    rootConn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root", // MAMP default; if you use XAMPP, set to ""
      port: 8889, // MAMP default; change to 3306 if XAMPP
    });

    // 2️⃣ Create your app database
    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );

    // 3️⃣ Create your app-specific user
    await rootConn.query(
      `CREATE USER IF NOT EXISTS '${process.env.DB_USER}'@'localhost' IDENTIFIED BY '${process.env.DB_PASSWORD}'`
    );

    // 4️⃣ Give full access to that user on your database
    await rootConn.query(
      `GRANT ALL PRIVILEGES ON ${process.env.DB_NAME}.* TO '${process.env.DB_USER}'@'localhost'`
    );

    // 5️⃣ Apply privilege changes
    await rootConn.query("FLUSH PRIVILEGES");

    res.send(
      `✅ Database '${process.env.DB_NAME}' and user '${process.env.DB_USER}' created successfully.`
    );
  } catch (err) {
    res.status(500).send("❌ Error initializing database/user: " + err.message);
  } finally {
    // Always close connection
    if (rootConn) await rootConn.end();
  }
}

module.exports = { initDB };
