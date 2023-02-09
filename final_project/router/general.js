const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
  

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User registered. Please, log in."});
      } else {
        return res.status(404).json({message: "This User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Please, insert username AND password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const authLenght = Object.keys(books);
    
    for (b = 1; b <= authLenght.length; b++){
        if (books[b]["author"] === req.params.author)
        var rightBook = b;
    }

    if(rightBook)
    res.send(books[rightBook]);
    else 
    res.send("Author not found");   
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const titleLenght = Object.keys(books);
    
    for (b = 1; b <= titleLenght.length; b++){
        if (books[b]["title"] === req.params.title)
        var rightTitle = b;
    }

    if(rightTitle)
    res.send(books[rightTitle]);
    else 
    res.send("Title not found");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    res.send(books[isbn]["reviews"]);
  
});

module.exports.general = public_users;
