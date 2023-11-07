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

  // Create a set to keep track of assigned user IDs for this ticket
  const assignedUsers = new Set(ticket.users.map(user => user.id));

  // Dropdown menu for assigning and removing employees
  let dropdown = `<select id="assignDropdown_${ticket.id}" class="assign-to-dropdown" multiple>`;
  for (let employee of employees) {
    dropdown += `<option value="${employee.id}" ${assignedUsers.has(employee.id) ? 'selected' : ''}>${employee.name}</option>`;
  }
  dropdown += '</select>';

  ticketRow.innerHTML = `
    <td>${ticket.name}</td>
    <td>${ticket.email}</td>
    <td>${ticket.businessName}</td>
    <td>${ticket.phoneNumber}</td>
    <td>${dropdown}</td>
    <td>
      <button class="assign-button" data-ticket-id="${ticket.id}">Assign</button>
      <button class="remove-button" data-ticket-id="${ticket.id}">Remove</button>
    </td>
  `;

  return ticketRow;
}


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

// Function to assign employees to a ticket
async function assignEmployeesToTicket(ticketId) {
  const selectElement = document.querySelector(`#assignDropdown_${ticketId}`);
  const selectedEmployeeIds = Array.from(selectElement.selectedOptions).map(option => option.value);

  await fetch(`/assignEmployeesToTicket/${ticketId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employeeIds: selectedEmployeeIds }),
  });

  // Refresh the ticket display after assigning employees
  const ticketData = await fetchAllTickets();
  displayTickets(ticketData);
}

// Function to remove employees from a ticket
async function removeEmployeesFromTicket(ticketId) {
  const selectElement = document.querySelector(`#assignDropdown_${ticketId}`);
  const selectedEmployeeIds = Array.from(selectElement.selectedOptions).map(option => option.value);

  await fetch(`/removeEmployeesFromTicket/${ticketId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employeeIds: selectedEmployeeIds }),
  });

  // Refresh the ticket display after removing employees
  const ticketData = await fetchAllTickets();
  displayTickets(ticketData);
}

// Event listener for fetching and displaying employees
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