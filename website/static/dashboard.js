// import {sendDataToBackend} from "./adminComments"

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
        ticketList.forEach(ticket => {
            if (status === 'all' || ticket.status === status || ticket.priority === status){
                const ticketItem = document.createElement('div');
            ticketItem.classList.add('ticket-item');
            ticketItem.innerHTML = `
                <div class="ticket-info">
                    ${ticket.subject.length > 10 ? '<strong>' + ticket.subject.substring(0, 1) + '</strong>' + ticket.subject.substring(1, 10) + "..." : '<strong>' + ticket.subject.substring(0, 1) + '</strong>' + ticket.subject.substring(1)}   
                    ${ticket.name.length > 10 ? '<strong>' + ticket.name.substring(0, 1) + '</strong>' + ticket.name.substring(1, 10) + "..." : '<strong>' + ticket.name.substring(0, 1) + '</strong>' + ticket.name.substring(1)}   
                    ${ticket.businessName.length > 10 ? '<strong>' + ticket.businessName.substring(0, 1) + '</strong>' + ticket.businessName.substring(1, 10) + "..." : '<strong>' + ticket.businessName.substring(0, 1) + '</strong>' + ticket.businessName.substring(1)}   
                    ${ticket.status === 'unresolved' ? '<strong>Unresolved</strong>' : ticket.status === 'resolved' ? '<strong>Resolved</strong>' : (ticket.status.length > 10 ? '<strong>' + ticket.status.substring(0, 1) + '</strong>' + ticket.status.substring(1, 10) + "..." : '<strong>' + ticket.status.substring(0, 1) + '</strong>' + ticket.status.substring(1))}
                    ${ticket.priority === 'lowpriority' ? '<strong>Low</strong>' : ticket.priority === 'highpriority' ? '<strong>High</strong>' : (ticket.priority.length > 10 ? '<strong>' + ticket.priority.substring(0, 1) + '</strong>' + ticket.priority.substring(1, 10) + "..." : '<strong>' + ticket.priority.substring(0, 1) + '</strong>' + ticket.priority.substring(1))}                    
                    <strong></strong> ${ticket.date}
                    <select class="priority-dropdown" onchange="changePriority(${ticket.id}, this.value)">
                    <option value="">Select Priority</option>
                    <option value="highpriority">High Priority</option>
                    <option value="lowpriority">Low Priority</option>
                </select>
                    <td>
                        <button class="unresolved-button" onclick="unresolveTicket(${ticket.id}, '${ticket.status}')">Unresolve</button>
                    </td>
                    <td>
                        <button class="resolve-button" onclick="resolveTicket(${ticket.id}, '${ticket.status}')">Resolve</button>
                    </td>
                    <a href="${getTicketPageLink(ticket.id)}" class="ticket-link" target="_blank">Ticket Details</a>
                </div>
            `;

            ticketItem.innerHTML += `
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

