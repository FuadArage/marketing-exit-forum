// const mysql2 = require("mysql2/promise");
// require("dotenv").config(); // Load environment variables from .env
// const fs = require("fs");
// //using .env for sensetive info
// const dbconnection = mysql2.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   ssl: {
//     ca: fs.readFileSync(process.env.CA)
//   },
// });

// console.log(process.env.DB_DATABASE);
// module.exports = dbconnection;

const mysql2 = require("mysql2/promise");
require("dotenv").config();
const fs = require("fs");

let sslConfig = undefined;

// ✅ Only add SSL if CA path is defined
if (process.env.CA) {
  try {
    sslConfig = {
      ca: fs.readFileSync(process.env.CA),
    };
  } catch (err) {
    console.error("Failed to read CA file:", err.message);
  }
}

const dbconnection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ...(sslConfig ? { ssl: sslConfig } : {}), // ✅ Only include SSL if defined
});

module.exports = dbconnection;
