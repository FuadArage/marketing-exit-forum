const express = require("express");
const { login } = require("../controller/loginController");

const loginRouter = express.Router();



loginRouter.post("/login", login);

module.exports = loginRouter;



