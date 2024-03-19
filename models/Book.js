const { query } = require('../config/database');

exports.createBook = async (title, author, description, price) => {
    try {
        const result = await query('INSERT INTO books (title, author, description, price) VALUES ($1, $2, $3, $4) RETURNING *', [title, author, description, price]);
        return result.rows[0];
    } catch (error) {
        console.error(`Error creating book: ${error.message}`);
        throw new Error('Error creating book');
    }
};

exports.getAllBooks = async () => {
    try {
        const result = await query('SELECT * FROM books');
        return result.rows;
    } catch (error) {
        console.error(`Error fetching books: ${error.message}`);
        throw new Error('Error fetching books');
    }
};

exports.deleteBookById = async (id) => {
    try {
        const result = await query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            throw new Error('Book not found');
        }
    } catch (error) {
        console.error(`Error deleting book: ${error.message}`);
        throw new Error('Error deleting book');
    }
};

exports.editBookById = async (id, title, author, description, price) => {
    try {
        const result = await query('UPDATE books SET title = $1, author = $2, description = $3, price = $4 WHERE id = $5 RETURNING *', [title, author, description, price, id]);
        if (result.rowCount === 0) {
            throw new Error('Book not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error(`Error updating book: ${error.message}`);
        throw new Error('Error updating book');
    }
};
