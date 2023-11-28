// Function to fetch all employees
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

// Function to display employees
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

// Function to create a row for an employee
function createEmployeeRow(employee) {
  const employeeRow = document.createElement('tr');
  employeeRow.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.username}</td>
      <td>${employee.role}</td>
      <td>
          ${employee.role !== 'admin' ? 
              `<button class="btn btn-danger delete-button" onclick="deleteEmployee(${employee.id})">Delete</button>` : ''}
      </td>
  `;

  return employeeRow;
}

// Function to delete an employee
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
              console.log("Could not delete user");
          }
      })
      .catch(error => {
          console.error('Error deleting employee:', error);
      });
  }
}

// Function to fetch all tickets
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

// Function to display tickets
async function displayTickets(ticketDetails) {
  const ticketlistContainer = document.querySelector('.ticket-list');
  ticketlistContainer.innerHTML = '';

  const employees = await fetchAllEmployees();
  if (ticketDetails) {
      ticketDetails.forEach(ticket => {
          const ticketRow = createTicketRow(ticket, employees);
          ticketlistContainer.appendChild(ticketRow);
      });
  }
}

// Function to create a row for a ticket
function createTicketRow(ticket, employees) {
  const ticketRow = document.createElement('tr');

  let dropdown = '<select class="form-control assign-to-dropdown">';
  dropdown += '<option value="">Assign to...</option>';
  for (let employee of employees) {
      dropdown += `<option value="${employee.id}">${employee.name}</option>`;
  }
  dropdown += '</select>';

  const assignButton = `<button class="btn btn-primary assign-button" onclick="assignEmployeeToTicket(${ticket.id}, this)">Assign</button>`;

  const assignedUsers = `<div class="assigned-users" id="assigned-users-${ticket.id}"></div>`;

  ticketRow.innerHTML = `
      <td>${ticket.name}</td>
      <td>${ticket.email}</td>
      <td>${ticket.businessName}</td>
      <td>${ticket.phoneNumber}</td>
      <td>${dropdown} ${assignButton}</td>
      <td>${assignedUsers}</td>
  `;
  fetchAssignedUsers(ticket.id)
  return ticketRow;
}

// Function to assign an employee to a ticket
function assignEmployeeToTicket(ticketId, buttonElement) {
  const dropdown = buttonElement.previousElementSibling;
  const employeeId = dropdown.value;
  if (employeeId) {
      fetch(`/assignTicket/${ticketId}/${employeeId}`, {
          method: 'POST',
      })
      .then(response => {
          if (response.ok) {
              fetchAssignedUsers(ticketId);
          } else {
              console.error('Failed to assign ticket');
          }
      })
      .catch(error => {
          console.error('Error assigning ticket:', error);
      });
  }
}

// Function to fetch assigned users
function fetchAssignedUsers(ticketId) {
  fetch(`/getAssignedUsers/${ticketId}`, {
      method: 'GET'
  })
  .then(response => response.json())
  .then(assignedUsers => {
      updateAssignedUsersList(ticketId, assignedUsers);
  })
  .catch(error => {
      console.error('Error fetching assigned users:', error);
  });
}

// Function to update the list of assigned users
function updateAssignedUsersList(ticketId, assignedUsers) {
  const assignedUsersDiv = document.getElementById(`assigned-users-${ticketId}`);
  if (assignedUsersDiv) {
      assignedUsersDiv.innerHTML = '';
      assignedUsers.forEach(user => {
          let userSpan = document.createElement('span');
          userSpan.textContent = user.name;
          userSpan.className = 'assigned-user badge badge-secondary';
          assignedUsersDiv.appendChild(userSpan);
      });
  }
}

// Event listeners
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
