'use strict';
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { allowedNodeEnvironmentFlags } = require('process');
const { devNull } = require('os');
// inquirer init

const promptQuestions = () => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'main',
        message: 'What would you like to do?',
        choices: [
          'View all Employees',
          'View all Departments',
          'Add Employee',
          'View all Roles',
          'Add Role',
          'Add Department',
          'Quit',
        ],
      },
    ])
    .then(answer => {
      switch (answer.main) {
        case 'View all Employees':
          viewEmployees();
          break;
        case 'View all Departments':
          viewDepartments();
          break;
        case 'View all Roles':
          viewRoles();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Quit':
          quit();
          break;
        default:
          break;
      }
    });
};

promptQuestions();

function viewEmployees() {
  const sql = `SELECT employee.*, roles.title 
               AS title, 
               roles.salary 
               AS salary
               FROM employee
               LEFT JOIN roles ON employee.role_id = roles.id`;

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(result);
    promptQuestions();
  });
}

function addEmployee() {
  const sql = `SELECT * FROM roles`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    inquirer
      .prompt([
        {
          name: 'first_name',
          type: 'input',
          message: "What is the employee's first name?",
        },
        {
          name: 'last_name',
          type: 'input',
          message: "what is the employee's last name?",
        },
        {
          name: 'role',
          type: 'list',
          choices: () => {
            let roleArray = [];
            for (let i = 0; i < result.length; i++) {
              roleArray.push(result[i].title);
            }
            return roleArray;
          },
          message: "What is the employee's role?",
        },
      ])
      .then(answer => {
        let roleId;
        for (let j = 0; j < result.length; j++) {
          if (result[j].title == answer.role) {
            roleId = result[j].id;
          }
        }
        db.query(
          `INSERT INTO employee SET ?`,
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: roleId,
          },
          (err, result) => {
            if (err) {
              res.status(400).json({ error: err.message });
              return;
            }
            console.log('Employee added!');
            promptQuestions();
          }
        );
      });
  });
}

function viewDepartments() {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(results);
    promptQuestions();
  });
}

// add department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'add_department',
        message: 'Enter new department name:',
      },
    ])
    .then(answer => {
      db.query(`INSERT INTO department SET ?`, {
        department_name: answer.add_department,
      });

      const sql = `SELECT * FROM department`;
      db.query(sql, (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        console.table(results);
        promptQuestions();
      });
    });
}

function viewRoles() {
  const sql = `SELECT * FROM roles`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(results);
    promptQuestions();
  });
}

function addRole() {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'add_role',
          message: 'New role: ',
        },
        {
          type: 'input',
          name: 'add_salary',
          message: 'Salary of new role: ',
        },
        {
          type: 'list',
          name: 'choose_department',
          choices: () => {
            let departmentArray = [];
            for (let i = 0; i < results.length; i++) {
              departmentArray.push(results[i].department_name);
            }
            return departmentArray;
          },
        },
      ])
      .then(answer => {
        let departmentId;
        for (let j = 0; j < results.length; j++) {
          if (results[j].department_name == answer.choose_department) {
            departmentId = results[j].id;
          }
        }
        db.query(
          `INSERT INTO roles SET ?`,
          {
            title: answer.add_role,
            salary: answer.add_salary,
            department_id: departmentId,
          },
          (err, result) => {
            if (err) {
              res.status(400).json({ error: err.message });
              return;
            }
            console.log('New role added!');
            promptQuestions();
          }
        );
      });
  });
}
// quit
function quit() {
  db.end();
}
