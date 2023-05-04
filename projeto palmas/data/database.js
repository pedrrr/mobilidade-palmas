const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    database: 'odpalmas',
    user: 'odPalmas',
    password: 'odPalmas'
});

module.exports = pool;