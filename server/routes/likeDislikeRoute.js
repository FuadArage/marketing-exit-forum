const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  likeQuestion,
  dislikeQuestion,
  likeAnswer,
  dislikeAnswer,
} = require("../controller/likeDislike.Controller");

const likeRouter = express.Router();

likeRouter.use(authMiddleware);

likeRouter.post("/questions/:question_id/like", likeQuestion);
likeRouter.post("/questions/:question_id/dislike", dislikeQuestion);
likeRouter.post("/answers/:answer_id/like", likeAnswer);
likeRouter.post("/answers/:answer_id/dislike", dislikeAnswer);

module.exports = likeRouter;