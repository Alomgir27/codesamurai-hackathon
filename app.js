const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./models");
require("dotenv").config();

const dbUrl = process.env.MONGODB_URI;

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
//@DESCRIPTION: Add a new book
app.post("/api/books", (req, res) => {
  const { id, title, author, genre, price } = req.body;
  //id is numic and price is float
  const book = new Book({
    id: parseInt(id),
    title: title,
    author: author,
    genre: genre,
    price: parseFloat(price),
  });
  book
    .save()
    .then((result) => {
      let { id, title, author, genre, price } = result;
      res.status(201).json({ id, title, author, genre, price });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
});



//@ROUTE: /api/books/:id
//@METHOD: PUT
//@DESCRIPTION: Update a book
app.put("/api/books/:id", (req, res) => {
  const id = req.params.id;
  const { title, author, genre, price } = req.body
  Book.findOne({ id: id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: `book with id: ${id} was not found`,
        });
      }
      book.title = title;
      book.author = author;
      book.genre = genre;
      book.price = price;
      return book.save();
    })
    .then((result) => {
      let { id, title, author, genre, price } = result;
      res.status(200).json({ id, title, author, genre, price });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
})


//@ROUTE: /api/books/:id
//@METHOD: GET
//@DESCRIPTION: Fetch a book by ID
app.get("/api/books/:id", (req, res) => {
  const id = req.params.id;
  Book.findOne({ id: id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: `book with id: ${id} was not found`,
        });
      }
      let { id, title, author, genre, price } = book;
      res.status(200).json({ id, title, author, genre, price });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
})





app.listen(3000, () => {
  console.log("Server running on port 3000");
});
