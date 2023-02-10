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
    let book = books[isbn];

    let userReview = req.session.authorization.username;

    if (book) {
        let review = req.query.review;
        if (review) {
            if (book.reviews.find(o => o.user))
            {
                let changeReview = book.reviews.find((o,i) => {
                    if (o.user == userReview) {
                        book.reviews[i] = {"user":userReview, "review": review};
                        books[isbn] = book;
                        res.send('Updated your review, ' + userReview);
                        return tr;
                    }
                });

                book["reviews"].push({"user":userReview, "review":review});
                books[isbn] = book;
            
                 res.send('There are other Reviews. Added another one');
            } else {
                book["reviews"].push({"user":userReview, "review":review});
                books[isbn] = book;
                
                
                res.send('The first review is yours ' + userReview);
            }         

        }
        
        res.send('Please, write a review, don\'t leave it blank');
    }
    else
    res.send('Something went wrong...' + book);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];

    let userReview = req.session.authorization.username;

    if(book){
        let deleteOwnReview = book.reviews.find((o,i) => {
            if (o.user == userReview) {
                delete book.reviews[i]
                res.send('Deleted your review in the book');
            }else{
            res.send('You have no review...');
            }
        });
    }else
    res.send('Something went wrong...');

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
