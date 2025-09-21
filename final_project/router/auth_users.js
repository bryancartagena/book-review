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
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
