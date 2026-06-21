package com.payroll.dao;

import com.payroll.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class EmployeeDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Employee> employeeRowMapper = new RowMapper<Employee>() {
        @Override
        public Employee mapRow(ResultSet rs, int rowNum) throws SQLException {
            Employee employee = new Employee();
            employee.setId(rs.getInt("id"));
            employee.setName(rs.getString("name"));
            employee.setDesignation(rs.getString("designation"));
            employee.setBasicSalary(rs.getDouble("basic_salary"));
            employee.setAllowances(rs.getDouble("allowances"));
            employee.setDeductions(rs.getDouble("deductions"));
            employee.setNetSalary(rs.getDouble("net_salary"));
            return employee;
        }
    };

    public boolean addEmployee(Employee employee) {
        String query = "INSERT INTO employees (name, designation, basic_salary, allowances, deductions, net_salary) VALUES (?, ?, ?, ?, ?, ?)";
        int rows = jdbcTemplate.update(query, 
                employee.getName(), 
                employee.getDesignation(), 
                employee.getBasicSalary(), 
                employee.getAllowances(), 
                employee.getDeductions(), 
                employee.getNetSalary());
        return rows > 0;
    }

    public Employee getEmployeeById(int id) {
        String query = "SELECT * FROM employees WHERE id = ?";
        List<Employee> employees = jdbcTemplate.query(query, employeeRowMapper, id);
        return employees.isEmpty() ? null : employees.get(0);
    }

    public List<Employee> getAllEmployees() {
        String query = "SELECT * FROM employees";
        return jdbcTemplate.query(query, employeeRowMapper);
    }

    public boolean updateEmployee(Employee employee) {
        String query = "UPDATE employees SET name=?, designation=?, basic_salary=?, allowances=?, deductions=?, net_salary=? WHERE id=?";
        int rows = jdbcTemplate.update(query, 
                employee.getName(), 
                employee.getDesignation(), 
                employee.getBasicSalary(), 
                employee.getAllowances(), 
                employee.getDeductions(), 
                employee.getNetSalary(), 
                employee.getId());
        return rows > 0;
    }

    public boolean deleteEmployee(int id) {
        String query = "DELETE FROM employees WHERE id = ?";
        int rows = jdbcTemplate.update(query, id);
        return rows > 0;
    }
}
