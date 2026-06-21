package com.payroll.service;

import com.payroll.dao.EmployeeDAO;
import com.payroll.model.Employee;

import java.util.List;

public class PayrollService {
    
    private EmployeeDAO employeeDAO;

    public PayrollService() {
        this.employeeDAO = new EmployeeDAO();
    }

    public double calculateNetSalary(double basic, double allowances, double deductions) {
        return (basic + allowances) - deductions;
    }

    public void addEmployee(String name, String designation, double basic, double allowances, double deductions) {
        double netSalary = calculateNetSalary(basic, allowances, deductions);
        Employee newEmployee = new Employee(0, name, designation, basic, allowances, deductions, netSalary);
        
        if (employeeDAO.addEmployee(newEmployee)) {
            System.out.println("Employee added successfully!");
        } else {
            System.out.println("Failed to add employee.");
        }
    }

    public void displayAllEmployees() {
        List<Employee> employees = employeeDAO.getAllEmployees();
        if (employees.isEmpty()) {
            System.out.println("No employees found.");
            return;
        }

        System.out.println("-----------------------------------------------------------------------------------------");
        System.out.printf("%-5s | %-20s | %-20s | %-12s | %-12s\n", "ID", "Name", "Designation", "Basic Salary", "Net Salary");
        System.out.println("-----------------------------------------------------------------------------------------");
        
        for (Employee emp : employees) {
            System.out.printf("%-5d | %-20s | %-20s | $%-11.2f | $%-11.2f\n",
                    emp.getId(), emp.getName(), emp.getDesignation(), emp.getBasicSalary(), emp.getNetSalary());
        }
        System.out.println("-----------------------------------------------------------------------------------------");
    }

    public void generateSalarySlip(int employeeId) {
        Employee emp = employeeDAO.getEmployeeById(employeeId);
        if (emp == null) {
            System.out.println("Employee not found with ID: " + employeeId);
            return;
        }

        System.out.println("\n========================================");
        System.out.println("             SALARY SLIP                ");
        System.out.println("========================================");
        System.out.println("Employee ID   : " + emp.getId());
        System.out.println("Name          : " + emp.getName());
        System.out.println("Designation   : " + emp.getDesignation());
        System.out.println("----------------------------------------");
        System.out.printf("Basic Salary  : $%.2f\n", emp.getBasicSalary());
        System.out.printf("Allowances    : $%.2f\n", emp.getAllowances());
        System.out.println("----------------------------------------");
        System.out.printf("Gross Salary  : $%.2f\n", (emp.getBasicSalary() + emp.getAllowances()));
        System.out.printf("Deductions    : $%.2f\n", emp.getDeductions());
        System.out.println("----------------------------------------");
        System.out.printf("NET SALARY    : $%.2f\n", emp.getNetSalary());
        System.out.println("========================================\n");
    }

    public void updateEmployee(int id, String name, String designation, double basic, double allowances, double deductions) {
        Employee emp = employeeDAO.getEmployeeById(id);
        if (emp != null) {
            emp.setName(name);
            emp.setDesignation(designation);
            emp.setBasicSalary(basic);
            emp.setAllowances(allowances);
            emp.setDeductions(deductions);
            emp.setNetSalary(calculateNetSalary(basic, allowances, deductions));

            if (employeeDAO.updateEmployee(emp)) {
                System.out.println("Employee updated successfully!");
            } else {
                System.out.println("Failed to update employee.");
            }
        } else {
            System.out.println("Employee not found!");
        }
    }

    public void deleteEmployee(int id) {
        if (employeeDAO.deleteEmployee(id)) {
            System.out.println("Employee deleted successfully!");
        } else {
            System.out.println("Failed to delete employee. ID may not exist.");
        }
    }
}
