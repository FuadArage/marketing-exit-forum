const express = require("express");
const { register } = require("../controller/registerController");

const registerRouter = express.Router();

registerRouter.post("/register", register);

module.exports = registerRouter;
