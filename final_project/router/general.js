const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (_req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = parseInt(req.params.isbn);

  if (!isbn || isbn <= 0) {
    return res.status(400).json({ message: "Please provide an isbn code." });
  }

  return res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  const allBooks = Object.values(books);

  if (!author) {
    return res.status(400).json({ message: "Please provide an author name" });
  }

  let book_filtered = allBooks.filter((book) => book.author.toLowerCase() === author.toLowerCase());

  if (book_filtered.length === 0) {
    return res.status(404).json({ message: `No books found by the author ${author}` });
  }

  return res.send(book_filtered);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  const allBooks = Object.values(books);

  if (!title) {
    return res.status(400).json({ message: "Please provide a title" });
  }

  let book_filtered = allBooks.filter((book) => book.title.toLowerCase() === title.toLowerCase());

  if (book_filtered.length === 0) {
    return res.status(404).json({ message: `No books found by the title ${title}` });
  }

  return res.send(book_filtered);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = parseInt(req.params.isbn);

  if (!isbn || isbn <= 0) {
    return res.status(400).json({ message: "Please provide an isbn code." });
  }

  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
