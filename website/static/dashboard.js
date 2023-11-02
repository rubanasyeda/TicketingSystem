async function fetchAllTickets() {
    try {
        const response = await fetch('/getAllTickets');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}




// a method to fetch team members
// async function fetchTeamMembers() {
//     try {
//         const response = await fetch('/getTeamMembers'); // Assuming you have an endpoint for this
//         if (!response.ok) {
//             throw new Error('Failed to fetch data');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return null;
//     }
// }

const teamMembers = [
    { name: 'John', assignedTickets: 3 },
    { name: 'Jane', assignedTickets: 5 },
    { name: 'Doe', assignedTickets: 2 },
];

function generateTeamMembersDropdown() {
    let dropdownHtml = '<div class="dropdown-container">'; 
    dropdownHtml += '<button class="assign-ticket-btn">Assign Ticket</button>';
    dropdownHtml += '<div class="team-dropdown">';
    teamMembers.forEach(member => {
        dropdownHtml += `
            <div class="team-member">
                ${member.name} (${member.assignedTickets} tickets)
                <button class="assign-btn" onclick="assignTicket(this, '${member.name}')">Assign</button>
            </div>
        `;
    });
    dropdownHtml += '</div>';
    dropdownHtml += '</div>';  
    return dropdownHtml;
}


function assignTicket(buttonElement, memberName) {
    if (buttonElement.innerText === 'Assign') {
        buttonElement.innerText = 'Unassign';
        buttonElement.classList.add('unassign-btn');
        alert(`Ticket has been assigned to ${memberName}`);
    } else {
        buttonElement.innerText = 'Assign';
        buttonElement.classList.remove('unassign-btn');
    }
}


function displayTickets(ticketList, status) {
    const ticketListContainer = document.querySelector('.ticket-list');
    ticketListContainer.innerHTML = '';

    if (ticketList) {
        ticketList.forEach(ticket => {
            if (status === 'all' || ticket.status === status || ticket.priority === status){
                const ticketItem = document.createElement('div');
            ticketItem.classList.add('ticket-item');
            ticketItem.innerHTML = `
                <div class="ticket-info">
                    <strong>Subject:</strong> ${ticket.subject}
                    <strong>FirstName:</strong> ${ticket.name}
                    <strong>BusinessName:</strong> ${ticket.businessName}
                    <strong>Status:</strong> ${ticket.status}
                    <strong>Priority:</strong> ${ticket.priority}
                    <strong>Date:</strong> ${ticket.date}
                    <a href="${getTicketPageLink(ticket.id)}" class="ticket-link" target="_blank">Ticket Details</a>
                    <td>
                        <button class="unresolved-button" onclick="unresolveTicket(${ticket.id})">Unresolve</button>
                    </td>
                    <td>
                        <button class="resolve-button" onclick="resolveTicket(${ticket.id})">Resolve</button>
                    </td>
                    <td>
                        <button class="highpriority-button" onclick="highPriorityTicket(${ticket.id})">HighPriority</button>
                    </td>
                    <td>
                        <button class="lowpriority-button" onclick="lowPriorityTicket(${ticket.id})">LowPriority</button>
                    </td>
                </div>
            `;

            ticketItem.innerHTML += `

                ${generateTeamMembersDropdown()}
            `;
            
            ticketListContainer.appendChild(ticketItem);
            }
        });
    }
}


function resolveTicket(ticketId) {
    const confirmed = window.confirm('Are you sure you want to change ticket status to resolve?');

    if(confirmed){
        fetch(`/resolveTicket/${ticketId}`, {
        method: 'POST',
        })
        .then(response => {
            if (response.status === 200) {
                location.reload();
            } else {
                console.log("Could not change the status")
            }
        })
        .catch(error => {
            console.error('Error changing the status:', error);
        });
    }
}

function unresolveTicket(ticketId) {
    const confirmed = window.confirm('Are you sure you want to change ticket status to unresolved?');

    if(confirmed){
        fetch(`/unresolveTicket/${ticketId}`, {
        method: 'POST',
        })
        .then(response => {
            if (response.status === 200) {
                location.reload();
            } else {
                console.log("Could not change the status")
            }
        })
        .catch(error => {
            console.error('Error changing the status:', error);
        });
    }
}


function highPriorityTicket(ticketId) {
    const confirmed = window.confirm('Are you sure you want to change ticket status to highpriority?');

    if(confirmed){
        fetch(`/highPriorityTicket/${ticketId}`, {
        method: 'POST',
        })
        .then(response => {
            if (response.status === 200) {
                location.reload();
            } else {
                console.log("Could not change the status")
            }
        })
        .catch(error => {
            console.error('Error changing the status:', error);
        });
    }
}


function lowPriorityTicket(ticketId) {
    const confirmed = window.confirm('Are you sure you want to change ticket status to lowpriority?');

    if(confirmed){
        fetch(`/lowPriorityTicket/${ticketId}`, {
        method: 'POST',
        })
        .then(response => {
            if (response.status === 200) {
                location.reload();
            } else {
                console.log("Could not change the status")
            }
        })
        .catch(error => {
            console.error('Error changing the status:', error);
        });
    }
}


document.getElementById('allTickets').addEventListener('click', async function () {
    const ticketData = await fetchAllTickets();
    displayTickets(ticketData, "all");
});

document.getElementById('unresolvedTickets').addEventListener('click', async function () {
    const ticketData = await fetchAllTickets();
    displayTickets(ticketData, "unresolved");
});

document.getElementById('resolvedTickets').addEventListener('click', async function () {
    const ticketData = await fetchAllTickets();
    displayTickets(ticketData, "resolved");
});

document.getElementById('highPriorityTickets').addEventListener('click', async function () {
    const ticketData = await fetchAllTickets();
    displayTickets(ticketData, "highpriority");
});

document.getElementById('lowPriorityTickets').addEventListener('click', async function () {
    const ticketData = await fetchAllTickets();
    displayTickets(ticketData, "lowpriority");
});


function getTicketPageLink(ticketId) {
    return `/ticketDetails/${ticketId}`;
}


