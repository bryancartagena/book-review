const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  let userExist = users.filter((user) => {
    return user.username === username;
  })

  return userExist.length > 0 ? true : false;
}

const authenticatedUser = (username, password) => { //returns boolean
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  return validUsers.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Unable to login. Please provide an username and password." });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    };
    return res.json({ message: "User successfully logged in." });
  } else {
    return res.status(400).json({ message: "Invalid login. Please provide a valid username and password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const newReview = req.query.review;
  const isbn = req.params.isbn;
  const username = req.session?.authorization?.username;
  if (!username || !isbn) {
    return res.status(400).json({ message: "Unable to add review. Missing isbn or not authenticated." });
  }
  if (!newReview) {
    return res.status(400).json({ message: "Please provide a review." });
  }
  const book = books[isbn];
  if (!book) {
    return res.status(400).json({ message: `Couldn't find book with isbn ${isbn}.` });
  }
  if (!book.reviews || typeof book.reviews !== 'object') {
    book.reviews = {};
  }
  const exists = Object.prototype.hasOwnProperty.call(book.reviews, username);
  book.reviews[username] = newReview;
  return res.json({ message: exists ? 'Book review updated.' : 'Book review added.', reviews: book.reviews[username] });
});

// Remove a book review by user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session?.authorization?.username;
  if (!username || !isbn) {
    return res.status(400).json({ message: "Unable to add review. Missing isbn or not authenticated." });
  }
  const book = books[isbn];
  if (!book) {
    return res.status(400).json({ message: `Couldn't find book with isbn ${isbn}.` });
  }
  if (!book.reviews || typeof book.reviews !== 'object') {
    book.reviews = {};
  }
  const exists = Object.prototype.hasOwnProperty.call(book.reviews, username);
  if (!exists) {
    return res.status(400).json({ message: "There's no review to delete." });
  }

  delete book.reviews[username];
  return res.json({ message: "Review successfully removed." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
