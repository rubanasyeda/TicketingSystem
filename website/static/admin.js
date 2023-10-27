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
    const employeelistContainer = document.querySelector('.Employee-list');
    employeelistContainer.innerHTML = '';

    if (employeeDetails) {
        employeeDetails.forEach(employee => {
            const employeeItem = createEmployeeItem(employee);
            employeelistContainer.appendChild(employeeItem);
        });
    }
}

function createEmployeeItem(employee) {
    const employeeItem = document.createElement('div');
    employeeItem.classList.add('employee-item');
    employeeItem.innerHTML = `
        <div class="employee-info">
            <strong>FirstName:</strong> ${employee.name}
            <strong>UserName:</strong> ${employee.username}
            <strong>Role:</strong> ${employee.role}
        </div>
    `;

    if (employee.role !== 'admin') {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteEmployee(employee.id);
        });
        employeeItem.appendChild(deleteButton);
    }

    return employeeItem;
}

function deleteEmployee(employeeId) {
    fetch(`/deleteUser/${employeeId}`, {
        method: 'POST',
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
