const express = require("express");
const { register } = require("../controller/registercontroller");

const registerRouter = express.Router();

registerRouter.post("/register", register);

module.exports = registerRouter;
