const dbconnection = require("../db/db.Config");
const { StatusCodes } = require("http-status-codes");

// Edit Answer Endpoint
async function editAnswer(req, res) {
  const { answer_id } = req.params;
  const { answer } = req.body;
  const user_id = req.user.userid;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Answer content is required" });
  }

  try {
    // Verify answer exists and belongs to user
    const [answerRecord] = await dbconnection.query(
      "SELECT user_id FROM answer WHERE answer_id = ?",
      [answer_id]
    );

    if (answerRecord.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Answer not found" });
    }

    if (answerRecord[0].user_id !== user_id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not authorized to edit this answer" });
    }

    // Update answer
    await dbconnection.execute(
      "UPDATE answer SET answer = ? WHERE answer_id = ?",
      [answer, answer_id]
    );

    res.json({ message: "Answer updated successfully" });
  } catch (error) {
    console.error("Error editing answer:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

// Delete Answer Endpoint
async function deleteAnswer(req, res) {
  const { answer_id } = req.params;
  const user_id = req.user.userid;

  try {
    // Verify answer exists and belongs to user
    const [answerRecord] = await dbconnection.query(
      "SELECT user_id FROM answer WHERE answer_id = ?",
      [answer_id]
    );

    if (answerRecord.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Answer not found" });
    }

    if (answerRecord[0].user_id !== user_id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not authorized to delete this answer" });
    }

    // Delete answer
    await dbconnection.query("DELETE FROM answer WHERE answer_id = ?", [
      answer_id,
    ]);

    res.json({ message: "Answer deleted successfully" });
  } catch (error) {
    console.error("Error deleting answer:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}
module.exports = {
  editAnswer,
  deleteAnswer,
};
