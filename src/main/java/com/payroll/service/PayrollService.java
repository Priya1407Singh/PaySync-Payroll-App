package com.payroll.service;

import com.payroll.dao.EmployeeDAO;
import com.payroll.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayrollService {
    
    @Autowired
    private EmployeeDAO employeeDAO;

    public double calculateNetSalary(double basic, double allowances, double deductions) {
        return (basic + allowances) - deductions;
    }

    public Employee addEmployee(Employee emp) {
        emp.setNetSalary(calculateNetSalary(emp.getBasicSalary(), emp.getAllowances(), emp.getDeductions()));
        boolean success = employeeDAO.addEmployee(emp);
        return success ? emp : null;
    }

    public List<Employee> getAllEmployees() {
        return employeeDAO.getAllEmployees();
    }

    public Employee getEmployeeById(int id) {
        return employeeDAO.getEmployeeById(id);
    }

    public Employee updateEmployee(int id, Employee updatedEmp) {
        Employee existingEmp = employeeDAO.getEmployeeById(id);
        if (existingEmp != null) {
            existingEmp.setName(updatedEmp.getName());
            existingEmp.setDesignation(updatedEmp.getDesignation());
            existingEmp.setBasicSalary(updatedEmp.getBasicSalary());
            existingEmp.setAllowances(updatedEmp.getAllowances());
            existingEmp.setDeductions(updatedEmp.getDeductions());
            existingEmp.setNetSalary(calculateNetSalary(
                updatedEmp.getBasicSalary(), 
                updatedEmp.getAllowances(), 
                updatedEmp.getDeductions()
            ));

            if (employeeDAO.updateEmployee(existingEmp)) {
                return existingEmp;
            }
        }
        return null;
    }

    public boolean deleteEmployee(int id) {
        return employeeDAO.deleteEmployee(id);
    }
}
