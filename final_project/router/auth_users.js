const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Login Failed - Fill username AND password"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 600 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("Login successfull");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username AND password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn]["review"];
    if (book) {
        let review = req.query.review;
        if (review) {
            book = review;
        }
        books[isbn]["review"] = book;
        res.send('dovrei aver scritto' + book);
    }
    else
    res.send('Qualcosa non va' + book);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
