const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

async function handleVote(req, res, type, isLike) {
  const id = req.params[`${type}_id`];
  const userId = req.user.userid;

  let typeIdColumn;
  if (type === "question") {
    typeIdColumn = "question_id";
  } else if (type === "answer") {
    typeIdColumn = "answer_id";
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid resource type." });
  }

  try {
    await dbconnection.query(
      `INSERT INTO likes_dislikes (user_id, ${typeIdColumn}, is_like) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE is_like = ?`,
      [userId, id, isLike, isLike]
    );

    const [counts] = await dbconnection.query(
      `SELECT
        SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) as likes,
        SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) as dislikes
       FROM likes_dislikes WHERE ${typeIdColumn} = ?`,
      [id]
    );

    res.status(StatusCodes.OK).json({
      likes: counts[0]?.likes || 0,
      dislikes: counts[0]?.dislikes || 0,
    });
  } catch (err) {
    console.error(`Error while voting on ${type}:`, err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Database error occurred." });
  }
}

const likeQuestion = (req, res) => handleVote(req, res, "question", 1);
const dislikeQuestion = (req, res) => handleVote(req, res, "question", 0);
const likeAnswer = (req, res) => handleVote(req, res, "answer", 1);
const dislikeAnswer = (req, res) => handleVote(req, res, "answer", 0);

module.exports = { likeQuestion, dislikeQuestion, likeAnswer, dislikeAnswer };
