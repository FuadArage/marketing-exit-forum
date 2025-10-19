const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

/**
 * Fetches all questions, joining with user_name and like/dislike counts.
 */
async function getquestions(req, res) {
  try {
    // ✅ Get user ID from token if logged in
    const userId = req.user?.userid;

    // ✅ Pagination (page number and how many per page)
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const offset = (page - 1) * pageSize;

    // ✅ Sorting: choose between 'popular' or 'recent'
    const sort = req.query.sort === "popular" ? "popular" : "recent";
    let orderBy = "q.created_at DESC";
    if (sort === "popular") orderBy = "likes DESC, q.created_at DESC";

    // ✅ Search keyword (optional)
    const search = req.query.search ? req.query.search.trim() : null;
    let whereClause = "";
    const countParams = [];
    const questionsParams = [];

    // ✅ If there is a search keyword, add WHERE conditions
    if (search) {
      whereClause = `WHERE (q.tag LIKE ? OR q.question_title LIKE ? OR q.question_description LIKE ?)`;
      const likeSearch = `%${search}%`;
      countParams.push(likeSearch, likeSearch, likeSearch);
      questionsParams.push(likeSearch, likeSearch, likeSearch);
    }

    // ✅ Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM question q ${whereClause}`;
    const [[{ total }]] = await dbconnection.query(countQuery, countParams);

    // ✅ Main question query with user votes and like/dislike counts
    const questionsQuery = `
      SELECT
        q.*,
        r.user_name,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes,
        CASE
          WHEN ul.is_like = 1 THEN 'up'
          WHEN ul.is_like = 0 THEN 'down'
          ELSE NULL
        END AS user_vote_type
      FROM
        question q
      JOIN
        registration r ON q.user_id = r.user_id
      LEFT JOIN (
        SELECT
          question_id,
          SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
        FROM
          likes_dislikes
        GROUP BY
          question_id
      ) AS ld ON q.question_id = ld.question_id
      LEFT JOIN likes_dislikes ul ON ul.question_id = q.question_id AND ul.user_id = ?
      ${whereClause}
      ORDER BY
        ${orderBy}
      LIMIT ? OFFSET ?;
    `;

    // ✅ userId || 0 ensures safe fallback if not logged in
    questionsParams.unshift(userId || 0);
    questionsParams.push(pageSize, offset);

    // ✅ Execute main query
    const [questions] = await dbconnection.query(
      questionsQuery,
      questionsParams
    );

    // ✅ Send result to frontend
    res.status(StatusCodes.OK).json({
      questions,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error retrieving questions:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving questions" });
  }
}

/**
 * Fetches a single question by ID, including user_name and like/dislike counts.
 */
async function getSingleQuestion(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.userid;

    const [questions] = await dbconnection.query(
      `
      SELECT
        q.*,
        r.user_name,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes,
        CASE
          WHEN ul.is_like = 1 THEN 'up'
          WHEN ul.is_like = 0 THEN 'down'
          ELSE NULL
        END AS user_vote_type
      FROM
        question q
      JOIN
        registration r ON q.user_id = r.user_id
      LEFT JOIN (
        SELECT
          question_id,
          SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
        FROM
          likes_dislikes
        GROUP BY
          question_id
      ) AS ld ON q.question_id = ld.question_id
      LEFT JOIN likes_dislikes ul ON ul.question_id = q.question_id AND ul.user_id = ?
      WHERE q.question_id = ?
    `,
      [userId || 0, id]
    );

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    res.status(StatusCodes.OK).json({ question: questions[0] });
  } catch (error) {
    console.error(
      `Error retrieving question with id ${req.params.id}:`,
      error.message
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving question" });
  }
}

module.exports = { getquestions, getSingleQuestion };
