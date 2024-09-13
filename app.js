const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config/serverConfig.js");
const { connectToDatabase } = require("./config/database.js");
const db = require("./models/index.js");
const userRouter = require("./routes/user.route.js");
const messageRouter = require("./routes/message.route.js");
const cookieParser = require("cookie-parser");
const { PORT } = config;

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

const setupAndStartServer = async () => {
  try {
    await connectToDatabase();
    //await db.sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log("Server started sucsessfully..."));
  } catch (error) {
    console.error("Someting went wrong in server setup", error);
  }
};
setupAndStartServer();
