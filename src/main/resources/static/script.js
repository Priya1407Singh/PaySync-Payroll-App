const API_URL = '/api/employees';
let allEmployees = []; // Store globally for search

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is "logged in" using localStorage (optional, but good for refresh)
    if(localStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('appPage').style.display = 'flex';
        fetchEmployees();
    }

    // Login Form Handler
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;

        if(user === 'admin' && pass === 'admin') {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('appPage').style.display = 'flex';
            localStorage.setItem('isLoggedIn', 'true');
            fetchEmployees();
        } else {
            alert('Invalid credentials! Hint: use admin/admin');
        }
    });

    document.getElementById('employeeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveEmployee();
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allEmployees.filter(emp => 
            emp.name.toLowerCase().includes(term) || 
            emp.designation.toLowerCase().includes(term)
        );
        renderEmployeeTable(filtered);
    });
});

// Logout Functionality
function logout() {
    localStorage.removeItem('isLoggedIn');
    closeModal('adminModal');
    document.getElementById('appPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('loginPass').value = ''; // Clear password
}

// Fetch all employees and update Dashboard
async function fetchEmployees() {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 2em; color: var(--primary);"></i><br><br>Refreshing data...</td></tr>`;
    
    try {
        const response = await fetch(API_URL);
        const employees = await response.json();
        
        // Add a tiny fake delay so the user "feels" the refresh happening
        setTimeout(() => {
            allEmployees = employees; // Store for search filtering
            renderEmployeeTable(employees);
            updateDashboardStats(employees);
            showToast('Table data refreshed successfully!');
        }, 600);
        
    } catch (error) {
        console.error('Error fetching employees:', error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color: var(--danger);">Error connecting to server!</td></tr>`;
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
            <td data-label="ID">#${emp.id}</td>
            <td data-label="Employee">
                <div class="emp-name-cell">
                    <div class="avatar">${emp.name.charAt(0).toUpperCase()}</div>
                    ${emp.name}
                </div>
            </td>
            <td data-label="Designation">${emp.designation}</td>
            <td data-label="Basic Salary">$${emp.basicSalary.toFixed(2)}</td>
            <td data-label="Net Salary" style="font-weight: bold; color: var(--success);">$${emp.netSalary.toFixed(2)}</td>
            <td data-label="Actions">
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
        
        // Open modal first so it resets, THEN populate our data
        openModal('addEmployeeModal');
        
        document.getElementById('empId').value = emp.id;
        document.getElementById('empName').value = emp.name;
        document.getElementById('empDesignation').value = emp.designation;
        document.getElementById('empBasic').value = emp.basicSalary;
        document.getElementById('empAllowances').value = emp.allowances;
        document.getElementById('empDeductions').value = emp.deductions;

        document.getElementById('modalTitle').innerText = 'Edit Employee';
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
        closeModal('selectSlipModal'); // Close select modal if open
        openModal('salarySlipModal');
    } catch (error) {
        console.error('Error generating salary slip:', error);
    }
}

// Open Select Slip Modal
function openSelectSlipModal() {
    const select = document.getElementById('slipEmployeeSelect');
    select.innerHTML = '';
    
    if (allEmployees.length === 0) {
        select.innerHTML = '<option value="">No employees available</option>';
    } else {
        allEmployees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id;
            option.innerText = `#${emp.id} - ${emp.name} (${emp.designation})`;
            select.appendChild(option);
        });
    }
    
    openModal('selectSlipModal');
}

// Generate Slip from Select Modal
function generateSlipFromSelect() {
    const select = document.getElementById('slipEmployeeSelect');
    const id = select.value;
    if (id) {
        viewSalarySlip(id);
    } else {
        alert("Please add an employee first!");
    }
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.visibility = 'visible';
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.style.visibility = 'hidden', 300);
    }, 2500);
}

// Toggle Dark Mode Theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    
    if (isDark) {
        showToast('Dark Mode Enabled!');
    } else {
        showToast('Light Mode Enabled!');
    }
}
