const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: { //we assume that sometimes the title and others are not required
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: false
  },
  genre: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;