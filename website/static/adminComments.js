var customerTicketId

async function fetchCurrentUserName(){
     try {
        const response = await fetch('/getCurrentUserName', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch current user name');
        }

        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error('Error fetching current user name:', error);
        throw error;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    function getQueryParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }

    const ticketId = getQueryParameter('ticketId');

    if (ticketId) {
        init(ticketId)
    }
  });


async function init(ticketId){
    try {
        customerTicketId = ticketId;

        const ticketNumberArea = document.getElementById("ticket-number");
        ticketNumberArea.textContent = ticketId;
        const ticketInfo = await fetchDataFromBackend(`${ticketId}`);
        const summaryMessage = `Name: ${ticketInfo.name}\nSubject: ${ticketInfo.subject}\nEmail: ${ticketInfo.email}\nBusiness: ${ticketInfo.businessName}\nPhone number: ${ticketInfo.phoneNumber}\nDescription: ${ticketInfo.description}`;
        addMainMessage("auto", summaryMessage);

        // get the messages and internal comments of that ticket
        const mainMessages = await fetchDataFromBackend(`${ticketId}/getMessages`);
        const internalmessages = await fetchDataFromBackend(`${ticketId}/getInternalMessages`);

        //getSTatus
        ticketStatus = await fetchDataFromBackend(`${ticketId}/getStatus`);
        showStatusChange(ticketStatus.status);

        function renderMessages() {
            mainMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            mainMessages.forEach((message) => {
                addMainMessage(message.sender, message.text, message.timestamp);
            });

            internalmessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            internalmessages.forEach((iMessage) => {
                addInternalMessage(iMessage.sender, iMessage.text, iMessage.timestamp);
            });
        }
        renderMessages()
    }
    catch (error) {
        console.error(error);
    }
}


// Event listener for sending messages
const userMessage = document.getElementById("user-message");
userMessage.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        mainSendButton.click();
    }
});

const mainSendButton = document.getElementById("send-button");
mainSendButton.addEventListener("click", async function () {
    try {

        const userMessage = document.getElementById("user-message");
        const messageText = userMessage.value.trim();
        const now = new Date();
        const userName = await fetchCurrentUserName();

        if (messageText !== "") {
            const currentSender = userName;
            const currentTime = now.toLocaleString();

            addMainMessage(currentSender, messageText, currentTime);
            userMessage.value = "";
            const messageData = {
                ticketNum: customerTicketId,
                text: messageText,
                sender: currentSender,
                timestamp: currentTime
            };
            sendDataToBackend("submitNewMessage", messageData);
        }
    } catch (error) {
        console.log("Error -- fetching user name")
    }
});

const internalSendButton = document.getElementById("admin-comment-upload");
internalSendButton.addEventListener("click", async function () {
    try {

        const internalUserMessage = document.getElementById("admin-comment-input");
        const internalMessageText = internalUserMessage.value.trim();
        internalUserMessage.value = "";
        const now = new Date();
        const userName = await fetchCurrentUserName();

        if (internalMessageText !== "") {
            const currentInternalSender = userName;
            const currentTime = now.toLocaleString();
            addInternalMessage(currentInternalSender, internalMessageText, currentTime);

            const messageData = {
                ticketNum: customerTicketId,
                text: internalMessageText,
                sender: currentInternalSender,
                timestamp: currentTime
            };
            sendDataToBackend("submitNewInternalMessage", messageData);
        }
    } catch (error) {
        console.log("Error -- fetching user name")
    }
});


const statusDropdown = document.getElementById("status-dropdown");

statusDropdown.addEventListener("change", function() {
    const autoSender = "auto";
    const selectedValue = statusDropdown.value; // Get the selected value
    const autoMesage = "The status has been changed to: " + selectedValue;
    const currentTime = new Date().toLocaleString(); // Use "new Date()" to get the current date and time

    addMainMessage(autoSender, autoMesage , currentTime);

    const messageData = {
        ticketNum: customerTicketId,
        status: selectedValue,
        text: autoMesage,
        sender: autoSender,
        timestamp: currentTime
    };
    sendDataToBackend("statusChange", messageData);

});

/**
 * General method to get data fromt he backend
 * @param {*} route that has the data
 * @returns the received data
 */
async function fetchDataFromBackend(route) {
try {
    const url = `/${route}`; // Customize the base URL
    const response = await fetch(url);

    if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
} catch (error) {
    throw new Error(`Request failed: ${error.message}`);
}
}

/**
 * General method to send data to the back-end
 * @param {*} route Route to send the data to
 * @param {*} data data to send
 * @returns succesful message if data was sent successfully
 */
async function sendDataToBackend(route, data) {
    try {
        const url = `${route}`; // Customize the base URL
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Page': 'adminComments',
        },
        body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw new Error(`Request failed: ${error.message}`);
    }
}

// Only two options
function showStatusChange(newStatus){
    if(newStatus === 1)
        document.getElementById('status-dropdown').selectedIndex=1;
    else{
        document.getElementById('status-dropdown').selectedIndex=0;
    }
}

// this will be used to add message on the page in the mainchat
function addMainMessage(sender, text, time) {
    const chatMessages = document.getElementById("chat-messages");

    const messageDiv = document.createElement("div");
    messageDiv.className = "message";

    const senderDiv = document.createElement("div");
    senderDiv.className = sender === "auto" ? "message-sender-auto" : "message-sender";
    senderDiv.textContent = sender === "auto" ? "" : sender;

    const textDiv = document.createElement("div");
    textDiv.className = sender === "auto" ? "message-text-auto" : "message-text";
    textDiv.textContent = text;

    const timeDiv = document.createElement("div");
    timeDiv.className = "timestamp";
    timeDiv.textContent = time;

    messageDiv.appendChild(senderDiv);
    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(timeDiv);

    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom to show the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Adds messages to the internal message chatbox
function addInternalMessage(sender, text, time) {
    const chatMessages = document.getElementById("admin-comment");

    const messageDiv = document.createElement("div");
    messageDiv.className = "message";

    const senderDiv = document.createElement("div");
    senderDiv.className = "message-sender";
    senderDiv.textContent = sender;

    const textDiv = document.createElement("div");
    textDiv.className ="message-text";
    textDiv.innerHTML =  text;

    const timeDiv = document.createElement("div");
    timeDiv.className = "timestamp";
    timeDiv.textContent = time;

    messageDiv.appendChild(senderDiv);
    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(timeDiv);

    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom to show the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// export {sendDataToBackend};

