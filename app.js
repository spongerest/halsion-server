require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const loggingMiddleware = require('./middlewares/loggingMiddleware');
const errorHandlingMiddleware = require('./middlewares/errorHandlingMiddleware');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const booksRoutes = require('./routes/books');
const authMiddleware = require('./middlewares/authMiddleware');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
// app.use(authMiddleware);
app.use(loggingMiddleware);

// Menghilangkan validationMiddleware dari penggunaan global

app.use('/api', loginRoutes);
app.use('/api', signupRoutes);
app.use('/api', booksRoutes);

// Penempatan error handling middleware di akhir
app.use(errorHandlingMiddleware);

// Rute sederhana untuk halaman utama
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Book API!" });
});
console.log(process.env.DB_HOST);


module.exports = app;