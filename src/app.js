const express = require("express");
const morgan = require("morgan");
const booksData = require("./booksData");
const cuid = require("cuid");

const app = express();

// PIPELINE STARTS HERE

// Application-level middleware - will run on every request
app.use(morgan("dev"));
app.use(express.json());

// Individual Routes
app.get("/greeting", (req, res) => {
  // if something went wrong, handle the error in some way
  res.send(`Hello, ${req.query.firstName} ${req.query.lastName}`);
});

app.get("/books", (req, res) => {
  res.json({ data: booksData });
});

app.get("/books/:bookId", (req, res) => {
  const book = booksData.find(book => book.id === req.params.bookId);
  if (!book) {
    res.status(404).json({ message: "Book not found" });
  } else {
    res.status(200).json({ data: book })
  }
});

app.post("/books", (req, res) => {
  console.log("body", req.body);

  const newBook = {
    id: cuid(),
    price: req.body.data.price,
  };

  // validate the data
  if (isNaN(req.body.data.price)) {
    res.status(400).json({ message: "Price must be a number" });
  } else {
    booksData.push(newBook);
    res.status(201).json({ data: newBook });
  }
});


app.use((req, res, next) => {
  next("Route not found");
});

// Error Handling Middleware
app.use(function errorHandlerMiddleware(error, req, res, next) {
  res.send(error);
});

// PIPELINE ENDS

module.exports = app;
