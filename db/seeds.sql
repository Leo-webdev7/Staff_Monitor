/* INSERT INTO course_names (name)
VALUES ('Intro to JavaScript'),
       ('Data Science'),
       ('Linear Algebra'),
       ('History of the Internet'),
       ('Machine Learning'),
       ('Game Design'),
       ('Cloud Development'); */
       

-- Insert departments
INSERT INTO departments (name) VALUES 
('Engineering'),
('Sales'),
('Marketing'),
('Human Resources');

-- Insert roles
INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 80000, 1),  -- department_id refers to 'Engineering'
('Sales Executive', 60000, 2),    -- department_id refers to 'Sales'
('Marketing Manager', 70000, 3),  -- department_id refers to 'Marketing'
('HR Specialist', 50000, 4);      -- department_id refers to 'Human Resources'

-- Insert employees (with manager relationships)
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),   -- Software Engineer with no manager
('Jane', 'Smith', 2, 1),    -- Sales Executive reporting to John Doe
('Sarah', 'Johnson', 3, 1), -- Marketing Manager reporting to John Doe
('Mike', 'Brown', 4, 1);    -- HR Specialist reporting to John Doe
