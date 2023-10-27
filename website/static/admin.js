async function fetchAllEmployees() {
    try {
        const response = await fetch('/getAllEmployees');
        if (!response.ok) {
            throw new Error('Failed to fetch employee data. Please try again later.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function displayEmployees(employeeDetails) {
    const employeelistContainer = document.querySelector('.employee-list');
    employeelistContainer.innerHTML = '';

    if (employeeDetails) {
        employeeDetails.forEach(employee => {
            const employeeRow = createEmployeeRow(employee);
            employeelistContainer.appendChild(employeeRow);
        });
    }
}

function createEmployeeRow(employee) {
    const employeeRow = document.createElement('tr');
    employeeRow.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.username}</td>
        <td>${employee.role}</td>
        <td>
            ${employee.role !== 'admin' ? 
                `<button class="delete-button" onclick="deleteEmployee(${employee.id})">Delete</button>` : ''}
        </td>
    `;

    return employeeRow;
}


function deleteEmployee(employeeId) {
    fetch(`/deleteUser/${employeeId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.status === 200) {
            // Provide user feedback for successful deletion if needed.
        } else {
            // Handle other response status codes or errors.
        }
    })
    .catch(error => {
        console.error('Error deleting employee:', error);
        // Provide user feedback for the error if needed.
    });
}

document.getElementById('getUsers').addEventListener('click', async function () {
    const employeeData = await fetchAllEmployees();
    displayEmployees(employeeData);
});
