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

//TASK 10 HERE! --- Get the book list available in the shop with callbacks
public_users.get('/books',function (req, res) {

    const getBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books, null, 4)));
      });
      getBooks.then(() => console.log("List on books with callbacks - T10"));
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });

 //TASK 11 HERE! --- Get book details based on ISBN
public_users.get('/books/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const getISBN = new Promise ((resolve, reject) => {
        resolve(res.send(books[isbn]));
    });
    getISBN.then(() => console.log("List of books with ISBN " + isbn +" - T11"))
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

//TASK 12 HERE!!! --- Get book details based on author
public_users.get('/books/author/:author',function (req, res) {
    const author = req.params.author;
    const authLenght = Object.keys(books);
    
    const getAuthor = new Promise ((resolve, reject) => {
        for (b = 1; b <= authLenght.length; b++){
            if (books[b]["author"] === req.params.author)
            var rightBook = b;
        }
  
            if(rightBook)
            resolve(res.send(books[rightBook]));
            else
            resolve(res.send("Author not found"));

        
    });
    getAuthor.then(() => console.log("Book of author " + author +" - T12"))
  
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

//TASK 13 HERE --- Get all books based on title
public_users.get('/books/title/:title',function (req, res) {
    const title = req.params.title;
    const titleLenght = Object.keys(books);

    const getTitle = new Promise ((resolve, reject) => {
    for (b = 1; b <= titleLenght.length; b++){
        if (books[b]["title"] === req.params.title)
        var rightTitle = b;
    }

    if(rightTitle)
    resolve(res.send(books[rightTitle]));
    else 
    resolve(res.send("Title not found"));

    });
    getTitle.then(() => console.log("Book with title: " + title +" - T13"))
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"]);
  
});



module.exports.general = public_users;
