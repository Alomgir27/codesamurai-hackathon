const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  id: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  _id: {
    type: Schema.Types.ObjectId,
    select: false,
  },
  __v: {
    type: Number,
    select: false,
  },
});

// create a model for the book schema
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
