const express = require("express");
const {
  deleteQuestion,
  editQuestion,
} = require("../controller/updataQuestionController");

const updateQuestionRouter = express.Router();

updateQuestionRouter.delete("/question/:question_id", deleteQuestion);
updateQuestionRouter.put("/question/:question_id", editQuestion);

module.exports = updateQuestionRouter;
