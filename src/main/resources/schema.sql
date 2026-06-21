CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0.00,
    deductions DECIMAL(10,2) DEFAULT 0.00,
    net_salary DECIMAL(10,2) NOT NULL
);
