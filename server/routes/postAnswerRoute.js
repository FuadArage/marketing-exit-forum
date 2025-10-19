// Answer API Endpoint Implementations
// Route: POST /api/answer
// Purpose: Accept an answer to a specific question from a user.

// to Add route in Express (routes/answer.js)

// const express = require("express");
// const {  postAnswer} = require("../controller/postAnswerController");
// const postAnswerRouter = express.Router();

// // POST /api/answer
// postAnswerRouter.post("/answer", postAnswer);

// module.exports = postAnswerRouter;


const express = require("express");
const { postAnswer } = require("../controller/postAnswerController");

const postAnswerRouter = express.Router();

postAnswerRouter.post("/answer", postAnswer);

module.exports = postAnswerRouter;
