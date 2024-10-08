const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => {
    return user.username === username;
});
if (userswithsamename.length > 0) {
    return true;
} else {
    return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
});
if (validusers.length > 0) {
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
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; 
    const review = req.query.review; 
    const username = req.session.authorization.username; 

  
    if (!review || !isbn) {
        return res.status(400).json({ message: "Review and ISBN are required." });
    }

  
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }


    const existingReviewIndex = book.reviews.findIndex(r => r.username === username);
    
    if (existingReviewIndex !== -1) {
      
        book.reviews[existingReviewIndex].review = review;
        return res.status(200).json({ message: "Review updated successfully." });
    } else {
        
        book.reviews.push({ username, review });
        return res.status(201).json({ message: "Review added successfully." });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; 
    const username = req.session.authorization.username; 

   
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    
    const reviewIndex = book.reviews.findIndex(r => r.username === username);
    
    if (reviewIndex !== -1) {
       
        book.reviews.splice(reviewIndex, 1);
        return res.status(200).json({ message: "Review deleted successfully." });
    } else {
       
        return res.status(404).json({ message: "Review not found for this user." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
