
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


async function fecthCurrentUserTickets(){
    try {
        const response = await fetch('/getCurrentUserTickets');
        if (!response.ok){
            throw new Error("Failed to Fetch Data")
        }
        return await response.json();
    }catch (error){
        console.error('Error fetching data:', error);
        return null;
    }
}

function displayTickets(ticketList, status) {
    const ticketListContainer = document.querySelector('.ticket-list');
    ticketListContainer.innerHTML = '';

    if (ticketList) {
        const table = document.createElement('table');
        table.classList.add('table', 'mt-4');

        const tableHeader = document.createElement('thead');
        tableHeader.innerHTML = `
            <tr>
                <th>SUBJECT</th>
                <th>SENDER</th>
                <th>BUISNESS</th>
                <th>STATUS</th>
                <th>PRIORITY</th>
                <th>DATE</th>
                <th>OPERATIONS</th>
                <th>TICKET DETAILS</th>
            </tr>
        `;
        table.appendChild(tableHeader);

        const tableBody = document.createElement('tbody');
        ticketList.forEach(ticket => {
            if (status === 'all' || ticket.status === status || ticket.priority === status) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${truncateText(ticket.subject, 15)}</td>
                    <td>${truncateText(ticket.name, 15)}</td>
                    <td>${truncateText(ticket.businessName, 15)}</td>
                    <td>${truncateText(getStatusText(ticket.status), 15)}</td>
                    <td>${truncateText(getPriorityText(ticket.priority), 15)}</td>
                    <td>${ticket.date}</td>
                    <td>
                        <select class="priority-dropdown" onchange="changePriority(${ticket.id}, this.value)">
                            <option value="">Select Priority</option>
                            <option value="highpriority">High Priority</option>
                            <option value="lowpriority">Low Priority</option>
                        </select>
                        <button class="unresolved-button" onclick="unresolveTicket(${ticket.id}, '${ticket.status}')">Unresolve</button>
                        <button class="resolve-button" onclick="resolveTicket(${ticket.id}, '${ticket.status}')">Resolve</button>
                    </td>
                    <td>
                        <button class="details-button" onclick="showTicketDetails(${ticket.id})">Show Details</button>
                    </td>

                `;
                tableBody.appendChild(row);
            }
        });
        table.appendChild(tableBody);

        ticketListContainer.appendChild(table);
    }
}


function showTicketDetails(ticketId) {
    const ticketPageLink = getTicketPageLink(ticketId);
    window.open(ticketPageLink, '_blank');
}


function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}

function getStatusText(status) {
    return status === 'unresolved' ? 'Unresolved' : status === 'resolved' ? 'Resolved' : status;
}

function getPriorityText(priority) {
    return priority === 'lowpriority' ? 'Low' : priority === 'highpriority' ? 'High' : priority;
}


function resolveTicket(ticketId, currentStatus) {
    if(currentStatus !== "resolved"){
            const confirmed = window.confirm('Are you sure you want to change ticket status to resolve?');

        if(confirmed){

            const autoSender = "auto";
            const selectedValue = "Resolved"; // Get the selected value
            const autoMesage = "The status has been changed to: " + selectedValue;
            const currentTime = new Date().toLocaleString(); // Use "new Date()" to get the current date and time

            const messageData = {
                ticketNum: ticketId,
                status: selectedValue,
                text: autoMesage,
                sender: autoSender,
                timestamp: currentTime
            };

            fetch("/statusChange", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Page': 'adminComments',
                },
                body: JSON.stringify(messageData),
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

            const autoSender = "auto";
            const selectedValue = "Unresolved"; // Get the selected value
            const autoMesage = "The status has been changed to: " + selectedValue;
            const currentTime = new Date().toLocaleString(); // Use "new Date()" to get the current date and time

            const messageData = {
                ticketNum: ticketId,
                status: selectedValue,
                text: autoMesage,
                sender: autoSender,
                timestamp: currentTime
            };
            // sendDataToBackend("submitNewMessage", messageData);

            fetch("/statusChange", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Page': 'adminComments',
                },
                body: JSON.stringify(messageData),
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


function changePriority(ticketId, priority) {
    const confirmed = window.confirm(`Are you sure you want to change ticket priority to ${priority}?`);
    if (confirmed) {
        fetch(`/changePriority/${ticketId}/${priority}`, {
            method: 'POST',
        })
        .then(response => {
            if (response.status === 200) {
                location.reload();
            } else {
                console.log("Could not change the priority")
            }
        })
        .catch(error => {
            console.error('Error changing the priority:', error);
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

document.getElementById('assignedTickets').addEventListener('click', async function () {
    const ticketData = await fecthCurrentUserTickets();
    displayTickets(ticketData, "all");
});

function getTicketPageLink(ticketId) {
    return `adminComments?ticketId=${ticketId}`;
}

