import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();



const PORT = process.env.PORT || 3001;
const app = express(); 

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



const asciiArt = `
███████╗████████╗ █████╗ ███████╗███████╗    ███╗   ███╗ ██████╗ ███╗   ██╗██╗████████╗ ██████╗ ██████╗ 
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██╔════╝    ████╗ ████║██╔═══██╗████╗  ██║██║╚══██╔══╝██╔═══██╗██╔══██╗
███████╗   ██║   ███████║█████╗  █████╗      ██╔████╔██║██║   ██║██╔██╗ ██║██║   ██║   ██║   ██║██████╔╝
╚════██║   ██║   ██╔══██║██╔══╝  ██╔══╝      ██║╚██╔╝██║██║   ██║██║╚██╗██║██║   ██║   ██║   ██║██╔══██╗
███████║   ██║   ██║  ██║██║     ██║         ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║   ██║   ╚██████╔╝██║  ██║
╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝         ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
`;


/* Inquirer here */

const mainMenu = () => {
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ]
    }
  ])
  .then((answers) => {
    switch (answers.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Exiting the application...');
          process.exit();  // Exits the application
          break;
        default:
          console.log('Invalid action');
          mainMenu(); // Return to menu if the action is invalid
          break;
    }
  }).catch((error) => {
    console.error('Error:', error);
  });
}


  /* Functions here  */

  /* Need to be filled */
  const viewAllDepartments = () => {
    // Query database
pool.query('SELECT * FROM employee_trk_db.departments', (err: Error, result: QueryResult) => {
  if (err) {
    console.log(err);
  } else if (result) {
    console.log('Departments List');
    console.table(result.rows);
    mainMenu();
  }
  });
  };

  /* Need to be filled */
  const viewAllRoles = () => {
  pool.query(/* 'SELECT * FROM employee_trk_db.roles' */`
    SELECT
      roles.id AS "Role ID",
      roles.title AS "Job Title",
      roles.salary AS "Salary",
      departments.name AS "Department Name"
    FROM 
      employee_trk_db.roles
    INNER JOIN 
      employee_trk_db.departments ON roles.department_id = departments.id;
  `, (err: Error, result: QueryResult) => {
  if (err) {
    console.log(err);
  } else if (result) {
    console.log('Departments List');
    console.table(result.rows);
    mainMenu();
  }
  });
  };

  /* Need to be filled */
  const viewAllEmployees = () => {
  pool.query(/* 'SELECT * FROM employee_trk_db.employees' */`
    SELECT 
      e.id AS "Employee ID",
      e.first_name AS "First Name",
      e.last_name AS "Last Name",
      r.title AS "Job Title",
      d.name AS "Department",
      r.salary AS "Salary",
      CONCAT(m.first_name, ' ', m.last_name) AS "Manager"
    FROM 
      employee_trk_db.employees e
    LEFT JOIN 
      employee_trk_db.roles r ON e.role_id = r.id
    LEFT JOIN 
      employee_trk_db.departments d ON r.department_id = d.id
    LEFT JOIN 
      employee_trk_db.employees m ON e.manager_id = m.id;
  `, (err: Error, result: QueryResult) => {
  if (err) {
    console.log(err);
  } else if (result) {
    console.log('Departments List');
    console.table(result.rows);
    mainMenu();
  }
  });
  };

  /* Need to be filled */
  const addDepartment = () => {
    // Use Inquirer to prompt for the department name
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the new department:',
      validate: (input) => {
        if (input) {
          return true;
        } else {
          return 'Please enter a valid department name.';
        }
      }
    }
  ]).then((answer) => {
    // Extract the department name from the answer
    const { departmentName } = answer;

    // SQL query to insert the new department into the database
    const query = 'INSERT INTO employee_trk_db.departments (name) VALUES ($1) RETURNING id';

    // Execute the pool query
    pool.query(query, [departmentName], (err, result) => {
      if (err) {
        console.error('Error inserting department:', err.stack);
      } else {
        console.log(`Department "${departmentName}" added successfully with ID ${result.rows[0].id}.`);
        mainMenu();
      }
    });
  }).catch((error) => {
    console.error('Error during prompt:', error);
  });
};


  /* Need to be filled */
  const addRole = () => {
    // First, fetch the list of departments from the database to provide options for selection
  pool.query('SELECT id, name FROM employee_trk_db.departments', (err, result) => {
    if (err) {
      console.error('Error fetching departments:', err.stack);
      pool.end(); // Close the connection in case of error
      return;
    }

    const departments = result.rows;

    // If no departments exist, we can't proceed with adding a role
    if (departments.length === 0) {
      console.log('No departments found. Please add a department first.');
      pool.end();
      return;
    }

    // Create an array of department names for the inquirer prompt
    const departmentChoices = departments.map(department => ({
      name: department.name,
      value: department.id
    }));

    // Use Inquirer to prompt for the role name, salary, and department
    inquirer.prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'Enter the name of the role:',
        validate: input => input ? true : 'Please enter a valid role name.'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the role:',
        validate: input => isNaN(input) ? 'Please enter a valid number for the salary.' : true
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for the role:',
        choices: departmentChoices
      }
    ]).then((answers) => {
      const { roleName, salary, departmentId } = answers;

      // SQL query to insert the new role into the database
      const insertRoleQuery = `
        INSERT INTO employee_trk_db.roles (title, salary, department_id)
        VALUES ($1, $2, $3) RETURNING id;
      `;

      // Execute the pool query to insert the role
      pool.query(insertRoleQuery, [roleName, salary, departmentId], (err, result) => {
        if (err) {
          console.error('Error inserting role:', err.stack);
        } else {
          console.log(`Role "${roleName}" added successfully with ID ${result.rows[0].id}.`);
        }
        mainMenu();
      });
    }).catch(error => {
      console.error('Error during prompt:', error);
      mainMenu();
    });
  });
  };

  /* Need to be filled */
  const addEmployee = () => {
    // First, fetch the list of roles and employees (managers) from the database
  pool.query('SELECT id, title FROM employee_trk_db.roles', (err, roleResult) => {
    if (err) {
      console.error('Error fetching roles:', err.stack);
      pool.end(); // Close the connection in case of error
      return;
    }

    const roles = roleResult.rows;

    if (roles.length === 0) {
      console.log('No roles found. Please add a role first.');
      pool.end();
      return;
    }

    pool.query('SELECT id, first_name, last_name FROM employee_trk_db.employees', (err, employeeResult) => {
      if (err) {
        console.error('Error fetching employees:', err.stack);
        pool.end(); // Close the connection in case of error
        return;
      }

      const employees = employeeResult.rows;

      // Create an array of role choices for Inquirer prompt
      const roleChoices = roles.map(role => ({
        name: role.title,
        value: role.id
      }));

      // Create an array of manager choices for Inquirer prompt
      const managerChoices = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }));

      // Add a "None" option for cases where the employee has no manager
      managerChoices.push({ name: 'None', value: null });

      // Use Inquirer to prompt for employee details
      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'Enter the employee\'s first name:',
          validate: input => input ? true : 'Please enter a valid first name.'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Enter the employee\'s last name:',
          validate: input => input ? true : 'Please enter a valid last name.'
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'Select the employee\'s role:',
          choices: roleChoices
        },
        {
          type: 'list',
          name: 'managerId',
          message: 'Select the employee\'s manager (if any):',
          choices: managerChoices
        }
      ]).then((answers) => {
        const { firstName, lastName, roleId, managerId } = answers;

        // SQL query to insert the new employee into the database
        const insertEmployeeQuery = `
          INSERT INTO employee_trk_db.employees (first_name, last_name, role_id, manager_id)
          VALUES ($1, $2, $3, $4) RETURNING id;
        `;

        // Execute the pool query to insert the employee
        pool.query(insertEmployeeQuery, [firstName, lastName, roleId, managerId], (err, result) => {
          if (err) {
            console.error('Error inserting employee:', err.stack);
          } else {
            console.log(`Employee "${firstName} ${lastName}" added successfully with ID ${result.rows[0].id}.`);
          }
         mainMenu();
        });
      }).catch(error => {
        console.error('Error during prompt:', error);
        pool.end(); // Close the connection in case of prompt error
      });
    });
  });
  };

  /* Need to be filled */
  const updateEmployeeRole = () => {
  // Step 1: Fetch all employees to present a list
  pool.query('SELECT id, first_name, last_name FROM employee_trk_db.employees', (err, employeeResults) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return;
    }

    const employees = employeeResults.rows.map(emp => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id
    }));

    // Step 2: Fetch all roles to present a list
    pool.query('SELECT id, title FROM employee_trk_db.roles', (err, roleResults) => {
      if (err) {
        console.error('Error fetching roles:', err);
        return;
      }

      const roles = roleResults.rows.map(role => ({
        name: role.title,
        value: role.id
      }));

      // Step 3: Prompt the user to select an employee and a new role
      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee whose role you want to update:',
          choices: employees
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'Select the new role for the employee:',
          choices: roles
        }
      ])
      .then(answers => {
        const { employeeId, roleId } = answers;

        // Step 4: Update the employee's role in the database
        const query = `
          UPDATE employee_trk_db.employees
          SET role_id = $1
          WHERE id = $2
          RETURNING employees.id, employees.first_name, employees.last_name, employees.role_id;
        `;

        pool.query(query, [roleId, employeeId], (err, result) => {
          if (err) {
            console.error('Error updating employee role:', err);
          } else {
            const updatedEmployee = result.rows[0];

            // Step 5: Fetch the updated employee details with the new role title
            const roleQuery = `
              SELECT employees.id, employees.first_name, employees.last_name, roles.title
              FROM employee_trk_db.employees
              JOIN employee_trk_db.roles ON employees.role_id = roles.id
              WHERE employees.id = $1;
            `;

            pool.query(roleQuery, [updatedEmployee.id], (err, roleResult) => {
              if (err) {
                console.error('Error fetching updated role title:', err);
              } else {
                console.log('Employee role updated successfully:');
                console.table(roleResult.rows); // Corrected: Use roleResult to display updated employee with role title
                mainMenu(); // Return to main menu after successful update
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  });
};




// Default response for any other request (Not Found)
app.use((_req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


console.log(asciiArt);
mainMenu();


