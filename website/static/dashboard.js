
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
            ticketListContainer.appendChild(ticketItem);
            }
        });
    }
}


// function resolveTicket(ticketId) {
//     const confirmed = window.confirm('Are you sure you want to change ticket status to resolve?');

//     if(confirmed){
//         fetch(`/resolveTicket/${ticketId}`, {
//         method: 'POST',
//         })
//         .then(response => {
//             if (response.status === 200) {
//                 location.reload();
//             } else {
//                 console.log("Could not change the status")
//             }
//         })
//         .catch(error => {
//             console.error('Error changing the status:', error);
//         });
//     }
// }

function resolveTicket(ticketId) {
    // Check if the ticket is already resolved
    fetch(`${ticketId}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Failed to check ticket status");
            }
        })
        .then(ticketInfo => {
            if (ticketInfo.status === "resolved") {
                // Ticket is already resolved, do nothing
                console.log("Ticket is already resolved");
            } else {
                // Confirm the resolution
                const confirmed = window.confirm('Are you sure you want to change ticket status to resolve?');

                if (confirmed) {
                    // If confirmed, proceed with the resolution
                    fetch(`/resolveTicket/${ticketId}`, {
                        method: 'POST',
                    })
                    .then(response => {
                        if (response.status === 200) {
                            location.reload();
                        } else {
                            console.log("Could not change the status");
                        }
                    })
                    .catch(error => {
                        console.error('Error changing the status:', error);
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error checking ticket status:', error);
        });
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

///////Will change////
// function getTicketPageLink(ticketId) {
//     return `/ticketDetails/${ticketId}`;
// }

function getTicketPageLink(ticketId) {
    return `adminComments?ticketId=${ticketId}`;
}

