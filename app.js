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
    console.log('connected as id ' + db.threadId);
});
//start function using inquirer and switch case to selecy function to query the database  
function startQuestion(){
    inquirer.prompt({ 
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['add department','add role','add employee','view departments','view roles','view employees','update employee role','delete department','delete role','delete employee','exit']
    })
    .then(function(answer){
        switch (answer.action){
            case 'add department':
                addDepartment();
                break;
            case 'add role':
                addRole();
                break;
            case 'add employee':
                addEmployee();
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
            case 'find employee by department':
                findEmployeeByDepartment();
                break;
            case 'update employee manager':
                updateEmployeeManager();
                break;
            case 'update employee role':
                updateEmployeeRole();
                break;
            case 'delete department':
                deleteDepartment();
                break;
            case 'delete role':
                deleteRole();
                break;
            case 'delete employee':
                deleteEmployee();
                break;
            case 'exit':
                db.end();
                break;
        }
    });
};
//fuction to add department
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
            startQuestion();
        });
    });
};
//function to add roles and assign them to a department
async function addRole(){
    var departments = [];
    var results = await db.promise().query('SELECT * FROM department');
    results[0].forEach(function(department){
        var choice = {
            value: department.id,
            name: department.name
        }
        departments.push(choice);
    });
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
                choices: departments  
            }
        ]).then(function(answer){
           
            db.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', [answer.title, answer.salary, answer.departmentId])
            console.log(answer);
            startQuestion();
        });
};
//function to add employees and get their manager and role
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
    var results = await db.promise().query('SELECT id, first_name, last_name FROM employee');
    results[0].forEach(function(manager){
        var choice = {
            value: manager.id,
            name: manager.first_name + ' ' +manager.last_name
        }
        managers.push(choice);
    });
    
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
        startQuestion();
    });
};
//view departments with console table
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
    startQuestion();
};
//view roles with console table
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
    startQuestion();
};
//view employees with console table
async function viewEmployees(){
    var employees= [];
    var results = await db.promise().query('SELECT e.first_name, e.last_name, title, salary, mgr.first_name AS mgr_first_name, mgr.last_name AS mgr_last_name FROM employee AS e LEFT JOIN role ON role.id = e.role_id LEFT JOIN employee AS mgr ON mgr.id = e.manager_id ');
    results[0].forEach(function(employee){
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
    startQuestion();
};
//function to update the employee roles
async function updateEmployeeRole(){
    var employees = [];
    var results = await db.promise().query('SELECT id, first_name, last_name FROM employee');
    results[0].forEach(function(employee){
        var item = {
            value: employee.id,
            name: employee.first_name + ' ' +employee.last_name
        }
        employees.push(item);
    });

    var roles = [];
    var results = await db.promise().query('SELECT id, title FROM role');
    results[0].forEach(function(role){
        var choice = {
            value: role.id,
            name: role.title
        }
        roles.push(choice);
    });
    console.table(employees)
    inquirer.prompt([
        {
            name: 'employeeSelect',
            type: 'list',
            message: 'Which employees role would you like to update?',
            choices: employees
        },
        {
            name: 'newDepartment',
            type: 'list',
            message: 'What is the employees new role?',
            choices: roles
        }
    ]).then(function(answer){
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.newDepartment,
        answer.employeeSelect]);
        startQuestion();
    });


}
//function to delete a role
async function deleteRole(){
    var roles = []
    var results =  await db.promise().query('SELECT id, title FROM role');
    results[0].forEach(function(role){
        var choice = {
            value: role.id,
            name: role.title
        }
        roles.push(choice);
    });
    console.table(roles)
    inquirer.prompt([
        {
            name: 'roleDelete',
            type: 'list',
            message: 'What role would you like to delete?',
            choices: roles
        }
    ]).then(function(answer){
        db.query('DELETE FROM role WHERE id = ?', answer.roleDelete);
        console.log('Role deleted');
        startQuestion();
    }); 

};
//function to delete a department
async function deleteDepartment(){
    var departments = []
    var results =  await db.promise().query('SELECT id, name FROM department');
    results[0].forEach(function(department){
        var choice = {
            value: department.id,
            name: department.name
        }
        departments.push(choice);
    });
    console.table(departments)
    inquirer.prompt([
        {
            name: 'departmentDelete',
            type: 'list',
            message: 'What department would you like to delete?',
            choices: departments
        }
    ]).then(function(answer){
        db.query('DELETE FROM department WHERE id = ?', answer.departmentDelete);
        console.log('Department deleted');
        startQuestion();
    }); 

};
//function to delete an employee 
async function deleteEmployee(){
    var employees = []
    var results =  await db.promise().query('SELECT id, first_name, last_name FROM employee');
    results[0].forEach(function(employee){
        var choice = {
            value: employee.id,
            name: employee.first_name + ' ' + employee.last_name
        }
        employees.push(choice);
    });
    console.table(employees)
    inquirer.prompt([
        {
            name: 'deleteWho',
            type: 'list',
            message: 'Who would you like to delete?',
            choices: employees
        }
    ]).then(function(answer){
        db.query('DELETE FROM employee WHERE id = ?', answer.deleteWho);
        console.log('Employee deleted');
        startQuestion();
    }); 

};

startQuestion();