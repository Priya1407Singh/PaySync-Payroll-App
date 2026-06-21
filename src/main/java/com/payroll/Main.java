package com.payroll;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
        System.out.println("=================================================");
        System.out.println("   EMPLOYEE PAYROLL SYSTEM STARTED SUCCESSFULLY  ");
        System.out.println("   Access the UI at: http://localhost:8080       ");
        System.out.println("=================================================");
    }
}
