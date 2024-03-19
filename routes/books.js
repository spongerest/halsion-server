const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authorizationMiddleware = require('../middlewares/authorizationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware')
const BooksController = require('../controllers/BookController');
const validateBook = [
    body('title').trim().not().isEmpty().withMessage('Judul tidak boleh kosong'),
    body('author').trim().not().isEmpty().withMessage('Pengarang tidak boleh kosong'),
    body('description').trim().not().isEmpty().withMessage('Deskripsi tidak boleh kosong'),
    body('price').isFloat({ gt: 0 }).withMessage('Harga harus lebih besar dari 0')
];

// Rute untuk menampilkan daftar buku
router.get('/books', BooksController.getBooks);

// Rute untuk menambah buku baru dengan validasi
router.post('/books',authMiddleware, [authorizationMiddleware(['admin']), validateBook], BooksController.addBook);

// Rute untuk menghapus buku berdasarkan ID dengan RBAC
router.delete('/books/:id',authMiddleware, authorizationMiddleware(['admin']), BooksController.deleteBook);

// Rute untuk mengedit detail buku berdasarkan ID dengan validasi dan RBAC
router.put('/books/:id',authMiddleware, [authorizationMiddleware(['admin']), validateBook], BooksController.editBook);

module.exports = router;
