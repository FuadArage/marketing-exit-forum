const express = require("express");
const { postQuestion } = require("../controller/postQuestionController");

const postQuestionRouter = express.Router();

postQuestionRouter.post("/questions", postQuestion);

module.exports = postQuestionRouter;