const inquirer = require('inquirer');
const sql = require('mysql2');
require('dotenv').config();

const db = sql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the company database.`)
);

process.on('exit',(code)=>{
  if(code===1){
    console.log('Something went wrong... Exiting Application');
  }
});

const newDeptQs = [
  {
    type: 'input',
    name: 'name',
    message: 'Please enter a name for the new department.'
  }
]; 

const newRoleQs = [
  {
    type: 'input',
    name: 'title',
    message: 'Please enter a title for the new role.'
  },
  {
    type: 'input',
    name: 'dept',
    message: 'Please enter the id number for the department this role belongs to.'
  },
  {
    type: 'input',
    name: 'salary',
    message: 'Please enter the salary for this role.'
  }
];



const newEmployeeQs = [
  {
    type:'input',
    name:'first_name',
    message:"Please enter the employee's first name."
  },
  {
    type:'input',
    name:'last_name',
    message:"Please enter the employee's last name."
  },
  {
    type: 'input',
    name: 'department',
    message: "Please enter which department the employee belongs to."
  },
  {
    type: 'input',
    name: 'role',
    message:"Please enter the employee's role."
  }
];

const actionQ = [{
  type: 'list',
  message: 'Please select an action.',
  choices: ['View all departments', 'Add a department', 'View all roles', 'Add a role', 'View all employees', 'Add an employee', 'Update an employee role',"Quit"],
  name: 'action'
}];


function init (){
  actionPrompt();
}

function actionPrompt(){
  inquirer.prompt(actionQ)
  .then(actionHandler)
  .catch((err)=>{
    console.log(err);
  });
}

function actionHandler (res){
  if(res.action==='View all departments'){
    showTable('departments');
  } else if (res.action==='View all roles'){
    showTable('roles');
  } else if (res.action==='View all employees'){
    showTable('employees');
  }else if(res.action==='Add a department'){
    inquirer.prompt(newDeptQs)
    .then((res)=>{addToTable('departments','dept_name',/* `"${res.name}"` */ [res.name])});
  }else if(res.action==='Add a role'){
    inquirer.prompt(newRoleQs)
    .then((res)=>{addToTable('roles','title, dept_id, salary',/* `"${res.title}","${res.dept}","${res.salary}"` */ [res.title,res.dept,res.salary])});
  }else if(res.action==='Add an employee'){
    inquirer.prompt(newEmployeeQs)
    .then((res)=>{addToTable('employees','first_name, last_name, role_id',/* `"${res.first_name}","${res.last_name}","${res.role}"` */ [res.first_name,res.last_name,res.department,res.role])});
  } else if (res.action ==='Quit'){
    process.exit(0);
  } else {
    process.exit(1);
  }
}

async function addToTable(table, rowFormat, rowContent){
  if(table==='employees'){
    console.log(rowContent);
    var deptID = -1;
    db.query(`SELECT dept_id FROM departments WHERE dept_name="${rowContent[2]}"`,
      (err,res)=>{
        if(err){console.log(err);}
        console.log(res);
        deptID = res[0].dept_id;
        console.log(deptID);
      }
    );
    console.log('deptID: '+deptID);
    db.query(`SELECT role_id FROM roles
      WHERE title="${rowContent[3]} AND dept_id=deptID;"`,
      (err,res)=>{
        if(err){console.log(err);}
        console.log(res);
      }
    );
  }
}

/* async function addToTable(table,rowFormat,rowContent){
  db.query(`INSERT INTO ${table} (${rowFormat})
  VALUES (${rowContent});`,
  (err,res)=>{
    if(err){console.log(err);}
    actionPrompt();
  });
} */

async function showTable(table){
  if(table === 'employees'){
    db.query(`SELECT employees.employee_id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary
      FROM employees
      INNER JOIN roles
      ON roles.role_id = employees.role_id
      INNER JOIN departments
      ON roles.dept_id = departments.dept_id`,
      (err,res)=>{
        if(err){console.log(err);}
        console.table(res, ["Employee ID","First Name","Last Name","Role","Department","Salary"]);
        actionPrompt();
    });
  } else {
      db.query(
        `SELECT * FROM ${table}`, (err,tb)=>{
          if(err){console.log(err);}
          console.table(tb);
          actionPrompt();
        },
      );
  }
}

init();