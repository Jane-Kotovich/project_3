const pgp = require("pg-promise")();
const connection = "postgres://jane@localhost:5432/schedule";
const db = pgp(connection);

module.exports = db;
