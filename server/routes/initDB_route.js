const express = require("express");
const { initDB } = require("../controller/initDB_controller");

const createDBRouter = express.Router();

createDBRouter.post("/initdb", initDB);

module.exports = createDBRouter;
