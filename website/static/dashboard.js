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
            if (status === 'all' || ticket.status === status){
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


