const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "Mjjmj13",
    host: "localhost",
    port: 5432,
    database: "expense_tracker"
});

module.exports = pool;