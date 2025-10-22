// imports
const express = require("express");
const cors = require("cors");
const dbconnection = require("./db/db.Config");
const dotenv = require("dotenv");

// configuring dotenv
dotenv.config();
const app = express();

// middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // ✅ Allow all origins dynamically
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//import admin routes correctly
const initDB_Router = require("./routes/initDB_route");
const createTableRouter = require("./routes/createTableRoute");

//import user routes
const registerRouter = require("./routes/registerRoute");
const loginRouter = require("./routes/loginRoute");
const passwordResetRouter = require("./routes/passwordResetRoute");
// import question and answer routes
const getquestions = require("./routes/getQuestionsRoute");
const getAnswerRouter = require("./routes/getAnswerRoute");
const postQuestionRoutes = require("./routes/postQuestionsRoute");
const postAnswerRoutes = require("./routes/postAnswerRoute");
const likeDislikeRouter = require("./routes/likeDislikeRoute");
const updateQuestionRouter = require("./routes/updateQuestionRoute");
const updateAnswerRouter = require("./routes/updateAnswerRoute");
///middle ware
const authMiddleware = require("./middleware/authMiddleware");

//-----All Routes---
//admin routes
app.use("/api/admin", initDB_Router);
app.use("/api/admin", createTableRouter);

//user routee middleware
app.use("/api/user", registerRouter);
app.use("/api/user", loginRouter);
app.use("/api/user", passwordResetRouter);

// question and answer routes middleware
app.use("/api", getquestions);
app.use("/api", getAnswerRouter);
app.use("/api", authMiddleware, postQuestionRoutes);
app.use("/api", authMiddleware, postAnswerRoutes);
app.use("/api", authMiddleware, likeDislikeRouter);
app.use("/api", authMiddleware, updateQuestionRouter);
app.use("/api", authMiddleware, updateAnswerRouter);

// profile routes
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", authMiddleware, profileRoutes);

async function startServer() {
  try {
    await dbconnection.execute("SELECT 'test'");
    app.listen(process.env.PORT || 5400, () => {
      console.log(
        `server is running on: http://localhost:${process.env.PORT || 5400}`
      );
      console.log("database connection successfull");
    });
  } catch (error) {
    console.log("Error connecting to the database", error.message);
  }
}

startServer();
