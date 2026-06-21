package com.payroll.dao;

import com.payroll.model.Employee;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EmployeeDAO {

    public boolean addEmployee(Employee employee) {
        String query = "INSERT INTO employees (name, designation, basic_salary, allowances, deductions, net_salary) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, employee.getName());
            pstmt.setString(2, employee.getDesignation());
            pstmt.setDouble(3, employee.getBasicSalary());
            pstmt.setDouble(4, employee.getAllowances());
            pstmt.setDouble(5, employee.getDeductions());
            pstmt.setDouble(6, employee.getNetSalary());

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public Employee getEmployeeById(int id) {
        String query = "SELECT * FROM employees WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return extractEmployeeFromResultSet(rs);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Employee> getAllEmployees() {
        List<Employee> employees = new ArrayList<>();
        String query = "SELECT * FROM employees";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            
            while (rs.next()) {
                employees.add(extractEmployeeFromResultSet(rs));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return employees;
    }

    public boolean updateEmployee(Employee employee) {
        String query = "UPDATE employees SET name=?, designation=?, basic_salary=?, allowances=?, deductions=?, net_salary=? WHERE id=?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, employee.getName());
            pstmt.setString(2, employee.getDesignation());
            pstmt.setDouble(3, employee.getBasicSalary());
            pstmt.setDouble(4, employee.getAllowances());
            pstmt.setDouble(5, employee.getDeductions());
            pstmt.setDouble(6, employee.getNetSalary());
            pstmt.setInt(7, employee.getId());

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteEmployee(int id) {
        String query = "DELETE FROM employees WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setInt(1, id);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private Employee extractEmployeeFromResultSet(ResultSet rs) throws SQLException {
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
}
