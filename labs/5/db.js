const mysql = require("mysql");
const path = require('path');
const fs = require("fs");
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const caCertificate = fs.readFileSync(
  path.resolve(__dirname, "ca-certificate.crt"),
  "utf8"
);

const dbConfig = {
    host: process.env.host,
    user: process.env.username,
    password: process.env.password,
    port: process.env.port,
    database: process.env.database,
    ssl: {
        ca: caCertificate
    }
}

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
    if (err) {
        console.error("Failed to make connection to db.", err);
        process.exit(1);
    }
    console.log("Successfully connected to db.")
});

module.exports = {
    connection
}