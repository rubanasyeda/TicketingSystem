// Dummy ticket data (you should fetch this from an external source)
const tickets = [
    {
        id: 1,
        sender: 'User 1',
        issue: 'Network Problem',
        priority: 'High',
        dateSubmitted: '2023-09-27',
        assigned: false,
        resolved: false,
    },
    {
        id: 2,
        sender: 'User 2',
        issue: 'Software Bug',
        priority: 'Medium',
        dateSubmitted: '2023-09-28',
        assigned: true,
        resolved: false,
    },
    // Add more ticket objects here
];

// Function to display tickets based on status
function displayTickets(ticketList, status) {
    const ticketListContainer = document.querySelector('.ticket-list');
    ticketListContainer.innerHTML = '';

    const filteredTickets = ticketList.filter((ticket) => {
        if (status === 'resolved') {
            return ticket.resolved === true;
        } else if (status === 'assigned') {
            return ticket.assigned === true;
        } else if (status === 'unresolved') {
            return !ticket.resolved;
        }
        // Default: Display all tickets
        return true;
    });

    filteredTickets.forEach((ticket) => {
        const ticketItem = document.createElement('div');
        ticketItem.classList.add('ticket-item');
        ticketItem.innerHTML = `
            <div class="ticket-info">
                <strong>Sender:</strong> ${ticket.sender}
                <strong>Issue:</strong> ${ticket.issue}
                <strong>Priority:</strong> ${ticket.priority}
                <strong>Date Submitted:</strong> ${ticket.dateSubmitted}
                <button class="assign-button">${ticket.assigned ? 'Unassign' : 'Assign'}</button>
                <button class="resolve-button">${ticket.resolved ? 'Resolved' : 'Resolve'}</button>
                <a href="${getTicketPageLink(ticket.id)}" class="ticket-link" target="_blank">Ticket Details</a>
            </div>
        `;

        // Add event listener for "Resolve" button
        const resolveButton = ticketItem.querySelector('.resolve-button');
        resolveButton.addEventListener('click', () => {
            // Toggle the resolved status and update the button text
            ticket.resolved = !ticket.resolved;
            resolveButton.textContent = ticket.resolved ? 'Resolved' : 'Resolve';

            // Display tickets based on their status
            displayTickets(tickets, status);
        });

        // Add event listener for "Assign" button
        const assignButton = ticketItem.querySelector('.assign-button');
        assignButton.addEventListener('click', () => {
            // Toggle the assigned status and update the button text
            ticket.assigned = !ticket.assigned;
            assignButton.textContent = ticket.assigned ? 'Unassign' : 'Assign';

            // Display tickets based on their status
            displayTickets(tickets, status);
        });

        ticketListContainer.appendChild(ticketItem);
    });
}

// Function to generate an external link for a ticket
function getTicketPageLink(ticketId) {
    // Replace this with the actual external link format
    return `https://example.com/tickets/${ticketId}`;
}

// Add event listeners for ticket sorting buttons
document.getElementById('allTickets').addEventListener('click', function () {
    // Display all tickets
    displayTickets(tickets, 'all');
});

document.getElementById('resolvedTickets').addEventListener('click', function () {
    // Display resolved tickets
    displayTickets(tickets, 'resolved');
});

document.getElementById('unresolvedTickets').addEventListener('click', function () {
    // Display unresolved tickets
    displayTickets(tickets, 'unresolved');
});

document.getElementById('assignedTickets').addEventListener('click', function () {
    // Display assigned tickets
    displayTickets(tickets, 'assigned');
});

// Initial display of all tickets
displayTickets(tickets, 'all');