const mySql = require('mySql2');
const inquirer = require('inquirer');
const consoleTable =require('console.table');

var db = mySql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Chauncit03',
    database: 'employee_trackDB'
});

db.connect(function(err){
    if (err) throw err;
    // console.table(HI)
    console.log('connected as id ' + db.threadId);
});

function startQuestion(){
    inquirer.prompt({ 
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['add employee','add department','add role','find employee by department','view departments','view roles','view employees','exit']
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
            case 'find employee by department':
                findEmployeeByDepartment();
                break;
            case 'update employee manager':
                updateEmployeeManager();
                break;
            case 'view departments':
                viewDepartments();
                break;
            case 'view roles':
                viewRoles();
                break;  
            case 'view employees':
                viewEmployees();
                break;   
            case 'exit':
                db.end();
                break;
        }
    });
};

async function viewDepartments(){
    var departments = [];
    var results = await db.promise().query('SELECT name FROM department');
    results[0].forEach(function(department){
        var item = {
            name: department.name
        }
        departments.push(item);
    });
    const table = consoleTable.getTable(departments);
    console.log(table);
    nextAction();
};

async function viewRoles(){
    var roles= [];
    var results = await db.promise().query('SELECT title, salary, name FROM role LEFT JOIN department ON department.id = role.department_id');
    results[0].forEach(function(role){
        var item = {
            title: role.title,
            salary: role.salary,
            department: role.name
        }
        roles.push(item);
    });
    const table = consoleTable.getTable(roles);
    console.log(table);
    nextAction();
};

async function viewEmployees(){
    var employees= [];
    var results = await db.promise().query('SELECT e.first_name, e.last_name, title, salary, mgr.first_name AS mgr_first_name, mgr.last_name AS mgr_last_name FROM employee AS e LEFT JOIN role ON role.id = e.role_id LEFT JOIN employee AS mgr ON mgr.id = e.manager_id ');
    results[0].forEach(function(employee){
        console.log(employee)
        var item = {
            name: employee.first_name + ' ' + employee.last_name,
            title: employee.title,
            salary: employee.salary,
            manager: employee.mgr_first_name + ' ' + employee.mgr_last_name,
        };
        employees.push(item);
    });
    const table = consoleTable.getTable(employees);
    console.log(table);
    nextAction();
};

async function addEmployee(){
    var roles = [];
    var results = await db.promise().query('SELECT id, title FROM role');
        results[0].forEach(function(role){
            var choice = {
                value: role.id,
                name: role.title
            }
            roles.push(choice);
        });
    
    var managers = [];
    var results = await db.promise().query('SELECT id, first_name, last_name FROM employee') 
    // , function(err){
        // if(err) throw err;
        results[0].forEach(function(manager){
            var choice = {
                value: manager.id,
                name: manager.first_name + ' ' +manager.last_name
            }
            managers.push(choice);
        });
    // }); 
    
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
            type: 'rawlist',
            message: 'What is employee role id?',
            choices: roles
        },
        {
            name: 'managerId',
            type: 'rawlist',
            message: 'What is employees manager id?',
            choices: managers
        }
    ]).then(function(answer){
        db.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [answer.firstName, answer.lastName, answer.role, answer.managerId], function(err, res){ 
                if (err) throw err;
                
            }
        )
        console.log('employee added: ' + answer.firstName + ' ' + answer.lastName);
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
        db.query('INSERT INTO department (name) VALUES (?)', [answer.departmentName], function(err,res){
            if (err) throw err;
            console.log('Department added: ' + JSON.stringify(answer));
        nextAction();
        });
    });
};

function addRole(){
    db.query('SELECT * FROM department', function(err, res){
        if (err) throw err;
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
                type: 'rawlist',
                message: 'Which depatment?',
                choices: () => {
                    const list = [];
                    res.forEach(function(department){
                        var choice = {
                            value: department.id,
                            name: department.name
                        };
                        list.push(choice);
                    });
                    return list;
                    }    
            }
        ]).then(function(answer){
           
            db.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', [answer.title, answer.salary, answer.departmentId])
            console.log(answer);
            nextAction();
        })
        .catch(err => res)
    });
};

// function findEmployeeByDepartment(){
//     var departments = 
//      db.query('SELECT department.id, department.name FROM department LEFT JOIN role ON employee.role_id' );

//     var dpartmentArray = 
//       inquirer.prompt([
//         {
//             name: 'whatDept',
//             type: 'choices',
//             message: 'Which department would you like to select from?',
//             choices: departmentArray

//         }
//     ]).then(function(answer){
//         db.query(
//             'SELECT * FROM employee WHERE department_id = '
//         ) 
//         console.log(answer);
//         console.log(answer.value);
    
// });

// };

function nextAction(){
    inquirer.prompt([
        {
            name: 'whatNext',
            type: 'confirm',
            message: 'Would you like to take another action?(y,N)'
        }
        
    ]).then(function(answer){
        if (answer.whatNext == 'yes'){
            startQuestion();
        }else{
            db.end();
        }
    })
};
startQuestion();

function queryEmployee(){
    var query = db.query('SELECT * FROM ___ WHERE ___ ?', function(err,res){
        if(err) throw err;
        for (var i = 0; i < res.length; i++){

        }
    });
};

function deleteEmployee(){
    console.log('deleting employee');
    db.query('DELETE FROM ____ WHERE ?',{

    }, function(err,res){
        if (err) throw err;

    })
};

const employeeTable = [];
console.table(employeeTable)
