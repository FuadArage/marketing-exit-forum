const express = require("express");
const {
  deleteAnswer,
  editAnswer,
} = require("../controller/updateAnswerController");

const updateAnswerRouter = express.Router();

updateAnswerRouter.delete("/answer/:answer_id", deleteAnswer);
updateAnswerRouter.put("/answer/:answer_id", editAnswer);

module.exports = updateAnswerRouter;
