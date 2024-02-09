const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
require("dotenv").config();

const dbUrl = process.env.MONGODB_URI;

mongoose
  .connect(dbUrl)
  .then(async () => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
    process.exit();
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());


// Add routes here
app.use("/api", indexRouter);


app.listen(8000, () => {
  console.log("Server running on port 8000");
});
