const mongoose = require("mongoose");
const Book = require("./models");
require("dotenv").config();

const dbUrl = process.env.MONGODB_URI;

//connect to the database and clear the database
mongoose
  .connect(dbUrl)
  .then(async () => {
    console.log("Connected to database!");
    await Book.deleteMany({});
    console.log("Database cleared!");
    process.exit();
  })
  .catch((error) => {
    console.log("Connection failed!", error);
    process.exit();
  });
  