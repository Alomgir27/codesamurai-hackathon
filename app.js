const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./models");
require("dotenv").config();

const dbUrl = process.env.MONGODB_URI;
console.log(dbUrl);

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
    process.exit();
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());

//@ROUTE: /api/books
//@METHOD: POST
//@DESCRIPTION: User can add new books
//@RESPONSE_TYPE: json
//@RESPONSE_STATUS_CODE: 201
app.post("/api/books", (req, res) => {
  const { id, title, author, price } = req.body;
  console.log(req.body);
  const book = new Book({
    id,
    _id: new mongoose.Types.ObjectId(),
    title,
    author,
    price,
  });
  book
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Failed to add book!",
      });
    });
});


//@ROUTE: /api/books
//@METHOD: GET
//@DESCRIPTION: User can see all available books
//@RESPONSE_TYPE: json
//@RESPONSE_STATUS_CODE: 200
app.get("/api/books", (req, res) => {
  Book.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to fetch books!",
      });
    });
});

//@ROUTE: /books
//@METHOD: GET
//@DESCRIPTION: books can be searched and filtered using author information
//@RESPONSE_TYPE: json
//@RESPONSE_STATUS_CODE: 200
app.get("/books", (req, res) => {
  const { author, sort, order, limit } = req.query;
  let sortQuery = {};
  if (sort) {
    sortQuery[sort] = order === "asc" ? 1 : -1;
  }
  //do string regex search
  Book.find({ author })
    .sort(sortQuery)
    .limit(parseInt(limit))
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Failed to fetch books!",
      });
    });
});


let data = [
  {
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "price": 150
  },
  {
  "id": 2,
  "title": "1984",
  "author": "George Orwell",
  "price": 250
  },
  {
  "id": 3,
  "title": "Animal Farm",
  "author": "George Orwell",
  "price": 299
  }
];

//inserting data into the database
async function insertData() {
  try {
    await Book.insertMany(data);
    console.log("Data inserted successfully");
  } catch (error) {
    console.log("Failed to insert data", error);
  }
}

insertData();

async function deleteData() {
  try {
    await Book.deleteMany();
    console.log("Data deleted successfully");
  } catch (error) {
    console.log("Failed to delete data", error);
  }
}

// deleteData();




app.listen(3000, () => {
  console.log("Server running on port 3000");
});
