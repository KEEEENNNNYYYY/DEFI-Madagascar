require('dotenv').config({ path: __dirname + '/.env' });
const fs = require("fs");


const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
    /**
     * uncommit on prod branch
     */
    // ssl: {
    //     rejectUnauthorized: false,
    //     ca: fs.readFileSync('../ca.pem').toString(),
    //   },
});

module.exports = pool;
