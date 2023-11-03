async function fetchAllEmployees() {
  try {
    const response = await fetch('/getAllEmployees');
    if (!response.ok) {
      throw new Error('Failed to fetch employee data. Please try again later.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching employee data:', error);
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

  if (confirmed) {
    fetch(`/deleteUser/${employeeId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 200) {
          location.reload();
        } else {
          console.log("Could not delete user")
        }
      })
      .catch(error => {
        console.error('Error deleting employee:', error);
      });
  }
}

async function fetchAllTickets() {
  try {
    const response = await fetch('/getAllTickets');
    if (!response.ok) {
      throw new Error('Failed to fetch ticket data. Please try again later.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ticket data:', error);
    return null;
  }
}

function displayTickets(ticketDetails) {
  const ticketlistContainer = document.querySelector('.ticket-list');
  ticketlistContainer.innerHTML = '';

  if (ticketDetails) {
    ticketDetails.forEach(ticket => {
      const ticketRow = createTicketRow(ticket);
      ticketlistContainer.appendChild(ticketRow);
    });
  }
}

function createTicketRow(ticket) {
  const ticketRow = document.createElement('tr');
  ticketRow.innerHTML = `
    <td>${ticket.name}</td>
    <td>${ticket.email}</td>
    <td>${ticket.businessName}</td>
    <td>${ticket.phoneNumber}</td>
  `;

  return ticketRow;
}

document.getElementById('getUsers').addEventListener('click', async function () {
  const employeeData = await fetchAllEmployees();
  displayEmployees(employeeData);

  document.querySelector('.employee-table').style.display = 'table';
  document.querySelector('.ticket-table').style.display = 'none';
});

document.getElementById('assignTickets').addEventListener('click', async function () {
  const ticketData = await fetchAllTickets();
  displayTickets(ticketData);

  document.querySelector('.employee-table').style.display = 'none';
  document.querySelector('.ticket-table').style.display = 'table';
});
