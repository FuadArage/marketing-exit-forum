const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/db.Config");

// Controller: Send password reset link
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide an email address." });
  }

  try {
    // 1️⃣ Check if user exists
    const [userResult] = await dbConnection.query(
      "SELECT user_id, user_name FROM registration WHERE user_email = ?",
      [email]
    );

    if (userResult.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message:
          "If your email is registered, you will receive a reset link shortly.",
      });
    }

    const user = userResult[0];

    // 2️⃣ Create token + expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // 3️⃣ Save token
    await dbConnection.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.user_id, hashedToken, expiresAt]
    );

    // 4️⃣ Return reset URL in response (instead of sending email)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    res.status(StatusCodes.OK).json({
      success: true,
      resetUrl,
      message: "Password reset token generated successfully.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while processing your request.",
    });
  }
};

// Controller: Verify reset token validity
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const [tokenResult] = await dbConnection.query(
      "SELECT * FROM password_reset_tokens WHERE expires_at > NOW()"
    );

    let valid = false;
    let user_id;
    for (const row of tokenResult) {
      if (await bcrypt.compare(token, row.token)) {
        valid = true;
        user_id = row.user_id;
        break;
      }
    }

    if (!valid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        valid: false,
        message: "This password reset link is invalid or has expired.",
      });
    }

    res.status(StatusCodes.OK).json({ valid: true, user_id });
  } catch (error) {
    console.error("Verify Token Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error during token verification.",
    });
  }
};

// Controller: Reset the user's password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const [tokenResult] = await dbConnection.query(
      "SELECT * FROM password_reset_tokens WHERE expires_at > NOW()"
    );

    let user_id;
    let tokenIsValid = false;
    for (const row of tokenResult) {
      const isMatch = await bcrypt.compare(token, row.token);
      if (isMatch) {
        tokenIsValid = true;
        user_id = row.user_id;
        break;
      }
    }

    if (!tokenIsValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Token is invalid or has expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbConnection.query(
      "UPDATE registration SET password = ? WHERE user_id = ?",
      [hashedPassword, user_id]
    );

    await dbConnection.query(
      "DELETE FROM password_reset_tokens WHERE user_id = ?",
      [user_id]
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message:
        "Your password has been successfully reset. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while resetting password.",
    });
  }
};

module.exports = { forgotPassword, verifyResetToken, resetPassword };
