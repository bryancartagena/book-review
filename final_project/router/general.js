const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Unable to register user. Please provide an username and password." });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Unable to register user. User already exist." });
  }

  users.push({ "username": username, "password": password });
  return res.json({ message: "User successfully registered." });
});

async function getBooks() {
  return books;
}

// Get the book list available in the shop
public_users.get('/', async (_req, res) => {
  try {
    const data = await getBooks();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to load books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = parseInt(req.params.isbn);

  if (!isbn || isbn <= 0) {
    return res.status(400).json({ message: "Please provide an isbn code." });
  }

  try {
    const data = await getBooks();
    const book = data[isbn];

    if (!book) {
      return res.status(404).json({ message: `Book ${isbn} not found.` });
    }
    return res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to load book by isbn.", error: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  let author = req.params.author;

  if (!author) {
    return res.status(400).json({ message: "Please provide an author name." });
  }

  try {
    const data = await getBooks();
    const allBooks = Object.values(data);

    let book_filtered = allBooks.filter((book) => book.author.toLowerCase() === author.toLowerCase());

    if (book_filtered.length === 0) {
      return res.status(404).json({ message: `No books found by the author ${author}.` });
    }

    return res.json(book_filtered);

  } catch (error) {
    res.status(500).json({ message: "Failed to load book by author.", error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  let title = req.params.title;
  if (!title) {
    return res.status(400).json({ message: "Please provide a title" });
  }
  try {
    const data = await getBooks();
    const allBooks = Object.values(data);

    let book_filtered = allBooks.filter((book) => book.title.toLowerCase() === title.toLowerCase());

    if (book_filtered.length === 0) {
      return res.status(404).json({ message: `No books found by the title ${title}` });
    }

    return res.json(book_filtered);

  } catch (error) {
    res.status(500).json({ message: "Failed to load book by title.", error: error.message });
  }
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
