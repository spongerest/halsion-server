const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

// Buat direktori log jika belum ada
const logDirectory = path.join(__dirname, 'log');
ensureLogDirectory();

function ensureLogDirectory() {
    fs.promises.access(logDirectory, fs.constants.F_OK)
        .then(() => console.log('Log directory exists'))
        .catch(() => fs.promises.mkdir(logDirectory));
}

// Buat stream log yang melakukan rotasi harian
const logStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
}).on('error', (error) => {
    console.error('Log stream error:', error);
});

// Konfigurasi morgan
const loggingMiddleware = morgan('combined', {
    skip: (req, res) => res.statusCode < 400, // hanya log error responses
    stream: logStream
});

module.exports = loggingMiddleware;
