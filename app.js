const mySql = require('mySql');
const inquirer = require('inquirer');
const consoleTable =require('console.table');
const PORT = 3306;

// var server = ;


var connection = mySql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Chauncit03',
    database: 'employee_trackDB'
});

connection.connect(function(err){
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    // startQuestion();
});

function startQuestion(){
    inquirer.prompt({ 
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['add employee', 'add department','add role ','exit']
    })
    .then(function(answer){
        switch (answer.action){
            case 'add employee':
                addEmployee();
                break;
            case 'add department':
                addDepartment();
                break;
            case 'add role':
                addRole();
                break;
            case 'view employees by department':
                viewEmployeesByDepartment();
                break;
            case 'view employees by manager':
                viewEmlpoyeesByManager();
                break;
            case 'update employee role':
                updateEmployeeRole();
                break;
            case 'update employee manager':
                updateEmployeeManager();
                break;
            case 'exit':
                connection.end();
                break;
        }
    });
};

function addEmployee(){
    var employee = inquirer.answer;
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is employee first name?'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is employee last name?'
        },
        {
            name: 'role',
            type: 'input',
            message: 'What is employee role id?'
        },
        {
            name: 'managerId',
            type: 'input',
            message: 'What is employees manager id?'
        }
    ]).then(function(answer){
        console.log(employee);
        nextAction();
    });
};

function addDepartment(){
    inquirer.prompt([
        {
            name: 'departmentName',
            type: 'input',
            message: 'What is the name of the department?'
        }

    ]).then(function(answer){
        console.log(answer);
        nextAction();
    });
};

function addRole(){
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the title of the role?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary?'
        },
        {
            name: 'departmentId',
            type: 'input',
            message: 'What is the department id?'
        }
    ]).then(function(answer){
        console.log(answer);
        nextAction();
    });
};

function nextAction(){
    inquirer.prompt([
        {
            name: 'whatNext',
            type: 'confirm',
            message: 'Would you like to take another action?(y,N)'
        }
        
    ]).then(function(answer){
        if (answer.whatNext == 'y'){
            startQuestion();
        }else{
            connection.end();
        }
    })
}
startQuestion();
function queryEmployee(){
    var query = connection.query('SELECT * FROM ___ WHERE ___ ?'
    ,function(err,res){
        if(err) throw err;
        for (var i = 0; i < res.length; i++){

        }
    });
};

function deleteEmployee(){
    console.log('deleting employee');
    connection.query('DELETE FROM ____ WHERE ?',{

    }, function(err,res){
        if (err) throw err;

    })
};

