
package com.kloudspot.employee.service;

import com.kloudspot.employee.entity.Employee;
import com.kloudspot.employee.repository.EmployeeRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee createEmployee(Employee employee) {
        String email = normalizeEmail(employee.getEmail());

        if (employeeRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                "An employee with this email already exists"
            );
        }

        employee.setEmail(email);
        employee.setId(null);

        return employeeRepository.save(employee);
    }

    @Transactional(readOnly = true)
    public Page<Employee> getEmployees(
            String search,
            String department,
            String status,
            Pageable pageable) {

        Specification<Employee> spec =
            (root, query, cb) -> cb.conjunction();

        if (search != null && !search.isBlank()) {
            String pattern = "%" +
                search.trim().toLowerCase(Locale.ROOT) + "%";

            spec = spec.and((root, query, cb) ->
                cb.or(
                    cb.like(cb.lower(root.get("fullName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern)
                )
            );
        }

        if (department != null && !department.isBlank()) {
            spec = spec.and((root, query, cb) ->
                cb.equal(
                    cb.lower(root.get("department")),
                    department.trim().toLowerCase(Locale.ROOT)
                )
            );
        }

        if (status != null && !status.isBlank()) {
            spec = spec.and((root, query, cb) ->
                cb.equal(
                    root.get("employmentStatus").as(String.class),
                    status.trim().toUpperCase(Locale.ROOT)
                )
            );
        }

        return employeeRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Employee not found with ID: " + id
                )
            );
    }

    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        Employee existing = getEmployeeById(id);
        String email = normalizeEmail(updatedEmployee.getEmail());

        employeeRepository.findByEmail(email).ifPresent(found -> {
            if (!found.getId().equals(id)) {
                throw new IllegalArgumentException(
                    "An employee with this email already exists"
                );
            }
        });

        existing.setFullName(updatedEmployee.getFullName());
        existing.setEmail(email);
        existing.setPhoneNumber(updatedEmployee.getPhoneNumber());
        existing.setDepartment(updatedEmployee.getDepartment());
        existing.setDesignation(updatedEmployee.getDesignation());
        existing.setDateOfJoining(updatedEmployee.getDateOfJoining());
        existing.setSalary(updatedEmployee.getSalary());
        existing.setEmploymentStatus(
            updatedEmployee.getEmploymentStatus()
        );

        return employeeRepository.save(existing);
    }

    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        return email.trim().toLowerCase(Locale.ROOT);
    }
}
