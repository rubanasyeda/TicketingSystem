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

async function displayTickets(ticketDetails) {
  console.log('Displaying tickets:',ticketDetails);
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

  // Dropdown menu for assigning employees
  let dropdown = '<select class="assign-to-dropdown">';
  dropdown += '<option value="">Assign to...</option>'; // Default option
  for (let employee of employees) {
      dropdown += `<option value="${employee.id}">${employee.name}</option>`;
  }
  dropdown += '</select>';

  // Assign button
  const assignButton = `<button class="assign-button" onclick="assignEmployeeToTicket(${ticket.id}, this)">Assign</button>`;


  // Placeholder for assigned users
  const assignedUsers = `<div class="assigned-users" id="assigned-users-${ticket.id}"></div>`;

  ticketRow.innerHTML = `
      <td>${ticket.name}</td>
      <td>${ticket.email}</td>
      <td>${ticket.businessName}</td>
      <td>${ticket.phoneNumber}</td>
      <td>${dropdown} ${assignButton}</td>
      <td>${assignedUsers}</td>
  `;
  return ticketRow;
}


function assignEmployeeToTicket(ticketId, buttonElement) {
  const dropdown = buttonElement.previousElementSibling;
  const employeeId = dropdown.value;
  if (employeeId) {
      // Send a POST request to the backend
      // Harsh :-> have to create this post method
      fetch(`/assignTicket/${ticketId}/${employeeId}`, {
          method: 'POST',
      })
      .then(response => {
          if (response.ok) {
              // Update the assigned users list
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


function fetchAssignedUsers(ticketId) {
  fetch(`/getAssignedUsers/${ticketId}`, {
      method: 'POST'
  })
  .then(response => response.json())
  .then(assignedUsers => {
      if (assignedUsers) {
          updateAssignedUsersList(ticketId, assignedUsers);
      }
  })
  .catch(error => {
      console.error('Error fetching assigned users:', error);
  });
}

function updateAssignedUsersList(ticketId, assignedUsers) {
  const assignedUsersDiv = document.getElementById(`assigned-users-${ticketId}`);
  if (assignedUsersDiv) {
      // Clear current list
      assignedUsersDiv.innerHTML = '';

      // Add each assigned user to the list
      assignedUsers.forEach(user => {
          let userSpan = document.createElement('span');
          userSpan.textContent = user.name; // Assuming 'name' is a property of user
          userSpan.className = 'assigned-user';
          assignedUsersDiv.appendChild(userSpan);
      });
  }
}




document.getElementById('getUsers').addEventListener('click', async function () {
  const employeeData = await fetchAllEmployees();
  displayEmployees(employeeData);

  document.querySelector('.employee-table').style.display = 'table';
  document.querySelector('.ticket-table').style.display = 'none';
});

// Event listener for fetching and displaying tickets
document.getElementById('assignTickets').addEventListener('click', async function () {
  const ticketData = await fetchAllTickets();
  displayTickets(ticketData);

  document.querySelector('.employee-table').style.display = 'none';
  document.querySelector('.ticket-table').style.display = 'table';
});

// Event listener for assigning and removing employees
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('assign-button')) {
    const ticketId = event.target.getAttribute('data-ticket-id');
    assignEmployeesToTicket(ticketId);
  }

  if (event.target.classList.contains('remove-button')) {
    const ticketId = event.target.getAttribute('data-ticket-id');
    removeEmployeesFromTicket(ticketId);
  }
});