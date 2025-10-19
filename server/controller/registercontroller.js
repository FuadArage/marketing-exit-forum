const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/db.Config");
const xss = require("xss");

async function register(req, res) {
  try {
    const { username, first_name, last_name, email, password } = req.body;
    if (!username || !first_name || !last_name || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide all required fields",
      });
    }

    // Validate email format - additional
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        // 400
        error: "Bad Request",
        message: "Invalid email format",
      });
    }

    // Validate password strength (e.g., min 8 chars)
    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Password must be at least 8 characters",
      });
    }

    // Sanitize all user input to prevent XSS
    const sanitizedUsername = xss(username);
    const sanitizedFirstName = xss(first_name);
    const sanitizedLastName = xss(last_name);
    const sanitizedEmail = xss(email);

    // Check for existing user
    const [existing] = await dbConnection.query(
      "SELECT * FROM registration WHERE user_name = ? OR user_email = ?",
      [sanitizedUsername, sanitizedEmail]
    );
    // return res.json({username: username})
    if (existing.length > 0) {
      return res
        .status(StatusCodes.CONFLICT) // 409
        .json({ error: "Conflict", message: "User already existed" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into registration table
    const [result] = await dbConnection.query(
      "INSERT INTO registration (user_name, user_email, password) VALUES (?, ?, ?)",
      [sanitizedUsername, sanitizedEmail, hashedPassword]
    );

    // Insert into profile table
    await dbConnection.query(
      "INSERT INTO profile (user_id, first_name, last_name) VALUES (?, ?, ?)",
      [result.insertId, sanitizedFirstName, sanitizedLastName]
    );

    // Generate JWT
    const token = jwt.sign(
      { userid: result.insertId, username: sanitizedUsername },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      userid: result.insertId,
      username: sanitizedUsername,
      email: sanitizedEmail,
      first_name: sanitizedFirstName,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { register };
