const mysql = require("mysql");
const connection = mysql.createConnection({
    user: "root",
    host: "localhost",
    database: "dadastudios",
});

module.exports = connection;