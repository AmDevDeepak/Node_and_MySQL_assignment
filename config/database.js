const mysql = require("mysql2");
const config = require("./serverConfig.js");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = config;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const connectToDatabase = () => {
  return new Promise((res, rej) => {
    connection.connect((err) => {
      if (err) {
        console.error("Some error occurred while connecting to database", err);
        return rej(err);
      } else {
        console.log("Database connected successfully.");
        res(connection);
      }
    });
  });
};

module.exports = {
  connectToDatabase: connectToDatabase,
};
