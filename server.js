const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRouter");
const codeRouter = require("./routes/codeRouter");
require("dotenv").config();

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Mongodb Connection
mongoose.connect(
  process.env.MONGO_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log("Connect to the DB")
);

//Routing
app.use("/api/v1/user", userRouter);
app.use("/api/v1/code", codeRouter);

// App starting
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is running on port ${port}`));
