
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
                        <button class="unresolved-button" onclick="unresolveTicket(${ticket.id}, '${ticket.status}')">Unresolve</button>
                    </td>
                    <td>
                        <button class="resolve-button" onclick="resolveTicket(${ticket.id}, '${ticket.status}')">Resolve</button>
                    </td>
                    <td>
                        <button class="highpriority-button" onclick="highPriorityTicket(${ticket.id}, '${ticket.priority}')">HighPriority</button>
                    </td>
                    <td>
                        <button class="lowpriority-button" onclick="lowPriorityTicket(${ticket.id}, '${ticket.priority}')">LowPriority</button>
                    </td>
                </div>
            `;
            ticketListContainer.appendChild(ticketItem);
            }
        });
    }
}


function resolveTicket(ticketId, currentStatus) {
    if(currentStatus !== "resolved"){
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
}


function unresolveTicket(ticketId, currentStatus) {
    if(currentStatus !== "unresolved"){
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
}


function highPriorityTicket(ticketId, currentStatus) {
    if(currentStatus !== "highpriority"){
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
}

function lowPriorityTicket(ticketId, currentStatus) {
    if(currentStatus !== "lowpriority"){
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

///////Will change////
// function getTicketPageLink(ticketId) {
//     return `/ticketDetails/${ticketId}`;
// }

function getTicketPageLink(ticketId) {
    return `adminComments?ticketId=${ticketId}`;
}

