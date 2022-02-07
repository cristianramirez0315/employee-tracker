INSERT INTO Department (department_name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO Roles (title, salary, department_id)
VALUES 
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 130000, 2),
('Software Engineer', 120000, 2),
('Account Manager', 150000, 3),
('Accountant', 90000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES 
('john', 'doe', 1, null),
('peter', 'pepper', 7, null),
('leroy', 'slades', 6, 1),
('margot', 'gonzalez', 4, 1),
('steph', 'carry', 2, 1),
('edward', 'jones', 3, 2),
('peter', 'wilson', 8, 3),
('cristian', 'butt', 5, 3);