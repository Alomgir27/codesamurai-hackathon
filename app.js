const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./models");
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
app.put("/api/books/:id", async (req, res) => {
  const id = req.params.id;
  const { title, author, genre, price } = req.body
  try {
    const book = await Book.findOne({ id: id })
    if (!book) {
      return res.status(404).json({
        message: `book with id: ${id} was not found`,
      });
    }
    book.title = title;
    book.author = author;
    book.genre = genre;
    book.price = price;
    await book.save()
      .then(async (result) => {
        let { id, title, author, genre, price } = result;
        res.status(200).json({ id, title, author, genre, price });
      })
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
})


//@ROUTE: /api/books/:id
//@METHOD: GET
//@DESCRIPTION: Fetch a book by ID
app.get("/api/books/:id", async (req, res) => {
  try {
    await Book.findOne({ id: req.params.id })
      .then((result) => {
        if (!result) {
          return res.status(404).json({
            message: `book with id: ${req.params.id} was not found`,
          });
        }
        let { id, title, author, genre, price } = result;
        res.status(200).json({ id, title, author, genre, price });
      })
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
})  
  



//@ROUTE: /api/books
//@METHOD: GET
//@DESCRIPTION: Fetch all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ id: 1 })
    let booksData = books.map((book) => {
      let { id, title, author, genre, price } = book;
      return { id, title, author, genre, price };
    });
    //keep key here
    let searchField = req.query.title && "title" || req.query.author && "author" || req.query.genre && "genre";
    let sortField = req.query.sort || "id";
    let sortOrder = req.query.order || "ASC";
    //search
    if (searchField) {
      booksData = booksData.filter((book) => book[searchField] === req.query[searchField]);
    }
    //sort
    if (sortField) {
      booksData.sort((a, b) => {
        if (a[sortField] === b[sortField]) {
          return a.id - b.id;
        }
        if (sortOrder === "ASC") {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
      }
      );
    }
    res.status(200).json({ books: booksData });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});




app.listen(3000, () => {
  console.log("Server running on port 3000");
});
