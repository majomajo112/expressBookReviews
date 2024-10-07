const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
public_users.use(express.json());



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        
        if (!isValid(username)) {
          
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });
        }
    } else {
        
        return res.status(400).json({ message: "Username and password are required" });
    }
});

// Get the book list available in the shop
const fetchBooks = () => {
    return new Promise((resolve, reject) => {
        // Simulate fetching data
        setTimeout(() => {
            if (books) {
                resolve(books); // Resolve with the books data
            } else {
                reject(new Error("Books data not found")); // Reject if data not found
            }
        }, 100); // Simulate a delay of 100ms
    });
};

// Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
    fetchBooks()
        .then(bookList => {
            res.send(JSON.stringify(bookList, null, 4)); // Send the resolved data as a response
        })
        .catch(error => {
            console.error("Error fetching books:", error);
            res.status(500).send({ message: "Error fetching book list." }); // Send error response
        });
});

// Get book details based on ISBN
const fetchBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        // Simulate fetching data
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]); // Resolve with the book data
            } else {
                reject(new Error("Book not found")); // Reject if the book is not found
            }
        }, 100); // Simulate a delay of 100ms
    });
};

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    fetchBookByISBN(isbn)
        .then(book => {
            res.send(JSON.stringify(book, null, 4)); // Send the resolved book data as a response
        })
        .catch(error => {
            console.error("Error fetching book:", error);
            res.status(404).send({ message: "Book not found." }); // Send error response
        });
});
  
// Get book details based on author
const fetchBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        // Simulate fetching data
        setTimeout(() => {
            const allBooks = Object.keys(books).map(key => books[key]);
            const booksByAuthor = allBooks.filter(book => book.author === author);

            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor); // Resolve with the books by the author
            } else {
                reject(new Error("No books found for this author")); // Reject if no books are found
            }
        }, 100); // Simulate a delay of 100ms
    });
};

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    fetchBooksByAuthor(author)
        .then(booksByAuthor => {
            res.status(200).json(booksByAuthor); // Send the resolved data as a response
        })
        .catch(error => {
            console.error("Error fetching books:", error);
            res.status(404).json({ message: error.message }); // Send error response
        });
});

// Get all books based on title
const fetchBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        // Simulate fetching data
        setTimeout(() => {
            const allBooks = Object.keys(books).map(key => books[key]);
            const booksByTitle = allBooks.filter(book => book.title === title);

            if (booksByTitle.length > 0) {
                resolve(booksByTitle); // Resolve with the books by the title
            } else {
                reject(new Error("No books found for this title")); // Reject if no books are found
            }
        }, 100); // Simulate a delay of 100ms
    });
};

// Get book details based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    fetchBooksByTitle(title)
        .then(booksByTitle => {
            res.status(200).json(booksByTitle); // Send the resolved data as a response
        })
        .catch(error => {
            console.error("Error fetching books:", error);
            res.status(404).json({ message: error.message }); // Send error response
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
