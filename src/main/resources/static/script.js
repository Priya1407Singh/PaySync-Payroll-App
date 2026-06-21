const API_URL = '/api/employees';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();

    document.getElementById('employeeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveEmployee();
    });
});

// Fetch all employees and update Dashboard
async function fetchEmployees() {
    try {
        const response = await fetch(API_URL);
        const employees = await response.json();
        renderEmployeeTable(employees);
        updateDashboardStats(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

// Render Table
function renderEmployeeTable(employees) {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';

    if(employees.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px;">No employees found. Add one to get started!</td></tr>`;
        return;
    }

    employees.forEach(emp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${emp.id}</td>
            <td>
                <div class="emp-name-cell">
                    <div class="avatar">${emp.name.charAt(0).toUpperCase()}</div>
                    ${emp.name}
                </div>
            </td>
            <td>${emp.designation}</td>
            <td>$${emp.basicSalary.toFixed(2)}</td>
            <td style="font-weight: bold; color: var(--success);">$${emp.netSalary.toFixed(2)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-info" onclick="viewSalarySlip(${emp.id})" title="Salary Slip"><i class="fa-solid fa-file-invoice-dollar"></i></button>
                    <button class="btn btn-secondary" style="padding: 6px 12px;" onclick="editEmployee(${emp.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-danger" onclick="deleteEmployee(${emp.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Update Top Dashboard Stats
function updateDashboardStats(employees) {
    document.getElementById('totalEmployeesCount').innerText = employees.length;
    
    let totalPayroll = 0;
    employees.forEach(emp => totalPayroll += emp.netSalary);
    document.getElementById('totalPayrollAmount').innerText = `$${totalPayroll.toFixed(2)}`;

    let avg = employees.length > 0 ? (totalPayroll / employees.length) : 0;
    document.getElementById('avgSalaryAmount').innerText = `$${avg.toFixed(2)}`;
}

// Modal Handling
function openModal(modalId) {
    if(modalId === 'addEmployeeModal') {
        document.getElementById('employeeForm').reset();
        document.getElementById('empId').value = '';
        document.getElementById('modalTitle').innerText = 'Add New Employee';
    }
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Save or Update Employee
async function saveEmployee() {
    const id = document.getElementById('empId').value;
    const employeeData = {
        name: document.getElementById('empName').value,
        designation: document.getElementById('empDesignation').value,
        basicSalary: parseFloat(document.getElementById('empBasic').value),
        allowances: parseFloat(document.getElementById('empAllowances').value),
        deductions: parseFloat(document.getElementById('empDeductions').value)
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });

        if (response.ok) {
            closeModal('addEmployeeModal');
            fetchEmployees();
        } else {
            alert('Failed to save employee.');
        }
    } catch (error) {
        console.error('Error saving employee:', error);
    }
}

// Edit Employee (populate form)
async function editEmployee(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const emp = await response.json();
        
        document.getElementById('empId').value = emp.id;
        document.getElementById('empName').value = emp.name;
        document.getElementById('empDesignation').value = emp.designation;
        document.getElementById('empBasic').value = emp.basicSalary;
        document.getElementById('empAllowances').value = emp.allowances;
        document.getElementById('empDeductions').value = emp.deductions;

        document.getElementById('modalTitle').innerText = 'Edit Employee';
        openModal('addEmployeeModal');
    } catch (error) {
        console.error('Error fetching employee details:', error);
    }
}

// Delete Employee
async function deleteEmployee(id) {
    if(confirm('Are you sure you want to delete this employee?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchEmployees();
            } else {
                alert('Failed to delete employee.');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    }
}

// Generate Salary Slip
async function viewSalarySlip(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const emp = await response.json();
        
        const grossSalary = emp.basicSalary + emp.allowances;
        
        const slipHtml = `
            <div class="slip-header">
                <i class="fa-solid fa-wallet fa-3x" style="color: var(--primary); margin-bottom:10px;"></i>
                <h2>PaySync Inc.</h2>
                <p>Salary Slip for Employee #${emp.id}</p>
            </div>
            <div class="slip-row"><span>Name:</span> <strong>${emp.name}</strong></div>
            <div class="slip-row"><span>Designation:</span> <strong>${emp.designation}</strong></div>
            <div class="slip-divider"></div>
            <div class="slip-row"><span>Basic Salary:</span> <span>$${emp.basicSalary.toFixed(2)}</span></div>
            <div class="slip-row"><span>Allowances:</span> <span>$${emp.allowances.toFixed(2)}</span></div>
            <div class="slip-divider"></div>
            <div class="slip-row" style="font-weight: 500;"><span>Gross Earnings:</span> <span>$${grossSalary.toFixed(2)}</span></div>
            <div class="slip-row" style="color: var(--danger);"><span>Deductions:</span> <span>-$${emp.deductions.toFixed(2)}</span></div>
            <div class="slip-divider"></div>
            <div class="slip-row slip-total">
                <span>NET SALARY:</span> 
                <span>$${emp.netSalary.toFixed(2)}</span>
            </div>
        `;
        
        document.getElementById('slipContent').innerHTML = slipHtml;
        openModal('salarySlipModal');
    } catch (error) {
        console.error('Error generating salary slip:', error);
    }
}
