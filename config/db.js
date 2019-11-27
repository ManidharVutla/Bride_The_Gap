const mysql = require("mysql");
const config = require("config");

const connection = mysql.createConnection({
  host: "10.105.186.76",
  user: "mani",
  password: "mani",
  database: "btg"
});
connection.connect(err => {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = connection;
