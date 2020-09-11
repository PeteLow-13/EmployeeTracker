const mySql = reqire('mySql');
const inquirer = require('inquirer');

const PORT = 3306;

var server = ;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Chauncti03",
    database: ""
});

server.listen(PORT, function() {
    console.log('Server listening')
});