const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");
const { sendAnswerNotification } = require("../services/mailer");
const xss = require("xss");

async function postAnswer(req, res) {
  const { answer, user_id, question_id } = req.body;

  // Validate input
  if (!answer || !user_id || !question_id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Answer, user_id, and question_id are required.",
    });
  }

  // Sanitize answer to prevent XSS
  const sanitizedAnswer = xss(answer);

  // Validate types
  const questionIdNum = parseInt(question_id);
  const userIdNum = parseInt(user_id);
  if (isNaN(questionIdNum) || isNaN(userIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid question_id or user_id.",
    });
  }

  // Validate authentication
  if (!req.user || req.user.userid !== userIdNum) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: User ID does not match authenticated user.",
    });
  }

  try {
    // Check if question exists
    const [question] = await dbconnection.query(
      "SELECT question_id FROM question WHERE question_id = ?",
      [questionIdNum]
    );
    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Check if user exists
    const [user] = await dbconnection.query(
      "SELECT user_id FROM registration WHERE user_id = ?",
      [userIdNum]
    );
    if (user.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found.",
      });
    }

    // Insert answer
    const insertQuery = `
      INSERT INTO answer (answer, user_id, question_id, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `;
    const [result] = await dbconnection.query(insertQuery, [
      sanitizedAnswer,
      userIdNum,
      questionIdNum,
    ]);

    // Fetch email of the user who asked the question
    const [questionRows] = await dbconnection.query(
      `SELECT r.user_email 
       FROM question q 
       JOIN registration r ON q.user_id = r.user_id 
       WHERE q.question_id = ?`,
      [question_id]
    );

    if (questionRows.length > 0) {
      const email = questionRows[0].user_email;
      await sendAnswerNotification(email, question_id);
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Answer posted successfully.",
      answerId: result.insertId,
    });
  } catch (error) {
    console.error("Error posting answer:", {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage || null,
      sql: error.sql || null,
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.sqlMessage || "Server error while posting answer.",
    });
  }
}

module.exports = { postAnswer };
