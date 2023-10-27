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
    const confirmed = window.confirm('Are you sure you want to delete this user?');

    if(confirmed){
        fetch(`/deleteUser/${employeeId}`, {
        method: 'DELETE',
        })
        .then(response => {
            if (response.status === 200) {
                location.reload();
                // Provide user feedback for successful deletion if needed.
            } else {
                // Handle other response status codes or errors.
                console.log("Could not delete user")
            }
        })
        .catch(error => {
            console.error('Error deleting employee:', error);
            // Provide user feedback for the error if needed.
        });
    }
}
    

document.getElementById('getUsers').addEventListener('click', async function () {
    const employeeData = await fetchAllEmployees();
    displayEmployees(employeeData);

    const mainDiv = document.querySelector('.main');
    mainDiv.classList.add('users-background');
    // Show the table when "Get Users" button is clicked
    const employeeTable = document.querySelector('.employee-table');
    employeeTable.style.display = 'table'; // Display the table
});


