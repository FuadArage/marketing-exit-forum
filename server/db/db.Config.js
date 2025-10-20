const mysql2 = require("mysql2/promise");
require("dotenv").config(); // Load environment variables from .env

//using .env for sensetive info

const dbconnection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 8889,
  connectionLimit: 10,
});

console.log(process.env.DB_DATABASE);
module.exports = dbconnection;
