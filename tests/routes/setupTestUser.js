const { query } = require('../../config/database');
const bcrypt = require('bcryptjs');

async function addUserToDatabase({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const { rows } = await query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        [name, email, hashedPassword] // Gunakan hashedPassword
    );
    return rows[0].id;
}

async function deleteUserFromDatabase(userId) {
    await query('DELETE FROM users WHERE id = $1', [userId]);
}

module.exports = { addUserToDatabase, deleteUserFromDatabase };
