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
    message: 'Please enter the name of the department this role belongs to.'
  },
  {
    type: 'input',
    name: 'salary',
    message: 'Please enter the salary for this role (in thousands of dollars per year).'
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
    name: 'role',
    message:"Please enter the employee's job title."
  },
  {
    type: 'input',
    name: 'manager',
    message: "Please enter the name of the employee's manager."
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
    .then((res)=>{addToTable('departments', [res.name])});
  }else if(res.action==='Add a role'){
    inquirer.prompt(newRoleQs)
    .then((res)=>{addToTable('roles', [res.title,res.dept,res.salary])});
  }else if(res.action==='Add an employee'){
    inquirer.prompt(newEmployeeQs)
    .then((res)=>{addToTable('employees',[res.first_name,res.last_name,res.role,res.manager])});
  } else if (res.action === 'Update an employee role'){
    updateEmployeeHandler();
  } else if (res.action ==='Quit'){
    process.exit(0);
  } else {
    process.exit(1);
  }
}

async function addToTable(table, rowContent){
  if(table==='departments'){
    db.query(`INSERT INTO departments (dept_name) VALUES ("${rowContent[0]}")`,(err,res)=>{
      if(err){console.log(err)}
      else {console.log('Successfully created new department!')}
      actionPrompt();
    });
  } else if(table==='roles'){
    db.query(`SELECT dept_id FROM departments WHERE dept_name="${rowContent[1]}"`,(err,res)=>{
      if(err){console.log(err)}
      else{
        console.log(res);
        db.query(
        `INSERT INTO roles (title, dept_id, salary) VALUES ("${rowContent[0]}", "${res[0].dept_id}", "${rowContent[2]}")`,
        (err,res) => {
          if(err){console.log(err)}
          else {console.log('Successfully created new role!')}
          actionPrompt();
        }
      );}
    });
  } else if (table === 'employees'){
      db.query(`SELECT role_id FROM roles WHERE title = "${rowContent[2]}"`,
      (err,res)=>{
        if(err){console.log(err)}
        else {db.query(`INSERT INTO employees (first_name, last_name, role_id, manager) VALUES 
        ("${rowContent[0]}","${rowContent[1]}","${res[0].role_id}","${rowContent[3]}")`,
        (err,res)=>{
          if(err){console.log(err)}
          else {
            console.log('Successfully created new employee profile!');
          }
          actionPrompt();
        })}
      });
  }
/* 
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
  } */
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
    db.query(`SELECT employees.employee_id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary, employees.manager
      FROM employees
      INNER JOIN roles
      ON roles.role_id = employees.role_id
      INNER JOIN departments
      ON roles.dept_id = departments.dept_id`,
      tableHandler  
    );
  } else if (table === 'roles'){
    db.query(
      `SELECT roles.role_id, roles.title, departments.dept_name, roles.salary
      FROM roles
      INNER JOIN departments
      ON roles.dept_id = departments.dept_id`, 
      tableHandler
    );
  } else {  
    db.query(
      `SELECT * FROM ${table}`, 
      tableHandler
    );
  }
}

function tableHandler(err,tb){
  if(err){console.log(err)}
  else {console.table(tb)}
  actionPrompt();
}

async function updateEmployeeHandler(){
  db.query(`SELECT first_name, last_name FROM employees`,
  (err,res)=>{
    if(err){console.log(err)}
    else{
      const employeesArr = [];
      for(i=0;i<res.length;i++){
        var employeeName = res[i].first_name + " " + res[i].last_name;
        employeesArr.push(employeeName);
      }
      console.log(employeesArr);
      inquirer.prompt([{
        type: 'list',
        message: 'Please choose an employee.',
        choices: employeesArr,
        name: 'employee'
      },{
        type: 'input',
        message: "Please input the employee's new role.",
        name: 'role'
      }]).then((res)=>{
        db.query(`SELECT role_id FROM roles WHERE title = "${res.role}"`,
        (err,roleId)=>{
          if(err){console.log(err)}
          else{
            console.log(employeesArr.indexOf(res.employee)+1);
            db.query(`UPDATE employees SET role_id=${roleId[0].role_id} WHERE employee_id = ${employeesArr.indexOf(res.employee)+1}`,
            (err,res)=>{
              if(err){console.log(err)}
              else{
                console.log('Successfully updated employee role!');
                actionPrompt();
              }
            });
          }
        });
      });
    }
  });
}

init();