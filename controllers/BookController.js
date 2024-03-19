const Book = require('../models/Book');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');

// Logika untuk menampilkan daftar buku
exports.getBooks = async (req, res) => {
    try {
        // Query ke database untuk mengambil daftar buku
        const result = await query('SELECT * FROM books'); // Pastikan nama tabel sesuai dengan database Anda
        const books = result.rows; // Dengan pg, hasil query berada di property 'rows'

        // Kirim daftar buku sebagai respons
        res.json(books);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mencoba menampilkan buku' });
    }
};

exports.addBookValidationRules = () => {
    return [
    body('title').trim().not().isEmpty().withMessage('Judul tidak boleh kosong'),
    body('author').trim().not().isEmpty().withMessage('Pengarang tidak boleh kosong'),
    body('description').trim().not().isEmpty().withMessage('Deskripsi tidak boleh kosong'),
    body('price').isNumeric().withMessage('Harga harus berupa angka'),
    ];
}

exports.addBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, author, description, price } = req.body;
        const insertQuery = `
            INSERT INTO books (title, author, description, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await query(insertQuery, [title, author, description, price]);
        const newBook = result.rows[0];

        res.status(201).json({ message: 'Buku berhasil ditambahkan', book: newBook });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mencoba menambahkan buku' });
    }
}

exports.deleteBook = async (req, res) => {
    try {
        // Pastikan kita mendapatkan id dan merupakan integer
        const bookId = parseInt(req.params.id, 10);

        // Validasi id untuk memastikan itu angka
        if (isNaN(bookId)) {
            return res.status(400).json({ message: 'ID buku tidak valid' });
        }

        // Periksa apakah buku dengan ID yang diberikan ada di database
        const findResult = await query('SELECT * FROM books WHERE id = $1', [bookId]);
        
        if (findResult.rowCount === 0) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }

        // Hapus buku dari database
        await query('DELETE FROM books WHERE id = $1', [bookId]);

        // Kirim respons berhasil
        res.json({ message: 'Buku berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mencoba menghapus buku' });
    }
};


// Logika untuk mengedit detail buku
exports.editBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, author, description, price } = req.body;

        // Periksa apakah buku dengan ID yang diberikan ada di database
        const findResult = await query('SELECT * FROM books WHERE id = $1', [bookId]);
        if (findResult.rowCount === 0) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }

        // Update detail buku
        const updateQuery = `
            UPDATE books 
            SET title = COALESCE($1, title), 
                author = COALESCE($2, author), 
                description = COALESCE($3, description), 
                price = COALESCE($4, price)
            WHERE id = $5
            RETURNING *;
        `;
        const updatedBook = await query(updateQuery, [title, author, description, price, bookId]);

        // Kirim respons berhasil beserta buku yang telah diperbarui
        res.json({ message: 'Detail buku berhasil diperbarui', book: updatedBook.rows[0] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mencoba mengedit detail buku' });
    }
};
