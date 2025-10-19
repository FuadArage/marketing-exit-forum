const dbconnection = require("../db/db.Config");

const {
  create_registration,
  create_answer,
  create_profile,
  create_question,
  create_likes_dislikes,
} = require("../db/tables");

async function createTable(req, res) {
  try {
    await dbconnection.query(create_registration);
    await dbconnection.query(create_profile);
    await dbconnection.query(create_question);
    await dbconnection.query(create_answer);
    await dbconnection.query(create_likes_dislikes);
    res.send("ALL tables created successfully");
  } catch (error) {
    res.status(500).send("Eroor creating tables:" + error.message);
  }
}

module.exports = { createTable };
