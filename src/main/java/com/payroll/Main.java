package com.payroll;

import com.payroll.service.PayrollService;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        PayrollService payrollService = new PayrollService();
        boolean running = true;

        System.out.println("=================================================");
        System.out.println("     EMPLOYEE PAYROLL MANAGEMENT SYSTEM          ");
        System.out.println("=================================================");

        while (running) {
            System.out.println("\n--- MAIN MENU ---");
            System.out.println("1. Add Employee");
            System.out.println("2. View All Employees");
            System.out.println("3. Update Employee");
            System.out.println("4. Delete Employee");
            System.out.println("5. Generate Salary Slip");
            System.out.println("6. Exit");
            System.out.print("Enter your choice: ");

            int choice = -1;
            try {
                choice = Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a number.");
                continue;
            }

            switch (choice) {
                case 1:
                    System.out.print("Enter Name: ");
                    String name = scanner.nextLine();
                    System.out.print("Enter Designation: ");
                    String designation = scanner.nextLine();
                    System.out.print("Enter Basic Salary: ");
                    double basic = Double.parseDouble(scanner.nextLine());
                    System.out.print("Enter Allowances: ");
                    double allowances = Double.parseDouble(scanner.nextLine());
                    System.out.print("Enter Deductions: ");
                    double deductions = Double.parseDouble(scanner.nextLine());
                    
                    payrollService.addEmployee(name, designation, basic, allowances, deductions);
                    break;

                case 2:
                    payrollService.displayAllEmployees();
                    break;

                case 3:
                    System.out.print("Enter Employee ID to update: ");
                    int updateId = Integer.parseInt(scanner.nextLine());
                    System.out.print("Enter New Name: ");
                    String newName = scanner.nextLine();
                    System.out.print("Enter New Designation: ");
                    String newDesignation = scanner.nextLine();
                    System.out.print("Enter New Basic Salary: ");
                    double newBasic = Double.parseDouble(scanner.nextLine());
                    System.out.print("Enter New Allowances: ");
                    double newAllowances = Double.parseDouble(scanner.nextLine());
                    System.out.print("Enter New Deductions: ");
                    double newDeductions = Double.parseDouble(scanner.nextLine());

                    payrollService.updateEmployee(updateId, newName, newDesignation, newBasic, newAllowances, newDeductions);
                    break;

                case 4:
                    System.out.print("Enter Employee ID to delete: ");
                    int deleteId = Integer.parseInt(scanner.nextLine());
                    payrollService.deleteEmployee(deleteId);
                    break;

                case 5:
                    System.out.print("Enter Employee ID to generate slip: ");
                    int slipId = Integer.parseInt(scanner.nextLine());
                    payrollService.generateSalarySlip(slipId);
                    break;

                case 6:
                    System.out.println("Exiting System. Goodbye!");
                    running = false;
                    break;

                default:
                    System.out.println("Invalid choice! Please select between 1 and 6.");
            }
        }
        scanner.close();
    }
}
