const express = require("express");
const { createTable } = require("../controller/createTableController");

const createTableRouter = express.Router();

createTableRouter.post("/createtables", createTable);

module.exports = createTableRouter;
