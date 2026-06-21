CREATE DATABASE IF NOT EXISTS payroll_db;
USE payroll_db;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0.00,
    deductions DECIMAL(10,2) DEFAULT 0.00,
    net_salary DECIMAL(10,2) NOT NULL
);

-- Insert dummy data for testing
INSERT INTO employees (name, designation, basic_salary, allowances, deductions, net_salary) 
VALUES ('John Doe', 'Software Engineer', 60000.00, 5000.00, 2000.00, 63000.00);

INSERT INTO employees (name, designation, basic_salary, allowances, deductions, net_salary) 
VALUES ('Jane Smith', 'HR Manager', 55000.00, 4000.00, 1500.00, 57500.00);
