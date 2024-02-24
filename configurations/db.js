// in const DB = require("../../configurations/db");

require('dotenv').config();
const mysql = require('mysql2');

const DB = mysql.createConnection(process.env.DATABASE_URL);

DB.connect((err) => {
  if (err) {
    console.error("Unable to connect to the database:", err);
  } else {
    console.log('Connected to PlanetScale!');
    console.log("Connection has been established successfully.");
  }

  // // Close the connection after logging the status
  // DB.end();
});
module.exports = DB