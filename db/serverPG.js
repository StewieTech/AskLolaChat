const { Client } = require('pg')

const db = new Client({
    user: "postgres",
    host: "localhost",
    database: "userLola",
    password: "admin",
    port: 5432,
})
db.connect();

module.exports = db;
