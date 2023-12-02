import random
from flask import Blueprint,render_template,request,redirect,url_for,jsonify,flash
from datetime import datetime
from . import db
from .models import CustomerTicketInformation,sendEmail,User, Message, InternalMessage
from .models import statusEnum,priorityOrder
from flask_login import login_required,current_user
views = Blueprint('views', __name__)

#test route (this route is not used within regular activity flow)
"""
This route for testing : if you do not want to manually create ticket jus run this route
it will create 10 tickets for you, but make sure to use a valid email address here
if you want to test email address as well
"""
@views.route('/generateTestTickets', methods=['GET'])
def generate_test_tickets():
    # Generate 10 random tickets
    for _ in range(10):
        subject = f"Random Subject {_}"
        customerFirstName = f"Customer{_}"
        customerLastName = "Lastname"
        customerEmail = f"customer{_}@example.com"
        businessName = f"Business {_}"
        customerNumber = f"123456{_}"
        problemDescription = f"Random problem description {_}"

        customerInfo = CustomerTicketInformation(
            id=random.randint(0, 10000000000000),
            subject=subject, firstName=customerFirstName, lastName=customerLastName,
            email=customerEmail, businessName=businessName, phoneNumber=customerNumber,
            description=problemDescription
        )

        # Assign random status and priority
        customerInfo.status = random.choice(list(statusEnum))
        customerInfo.priority = random.choice(list(priorityOrder))
        admin_users = User.query.filter(User.role == 'admin').all()
        
        if admin_users:
            customerInfo.users.extend(admin_users)
        db.session.add(customerInfo)
    

    db.session.commit()

    return "Test data generated successfully"

"""
 for testing purpose : if you want to delete all tickets in database run this route
"""
#test route (this route is not used within regular activity flow)
@views.route('/deleteTestTickets', methods=['GET'])
def delete_test_tickets():
    # Check if the current user is authenticated and an admin
    if not current_user.is_authenticated or current_user.role != "admin":
        return redirect(url_for('auth.login'))

    # Find and delete all test tickets
    test_tickets = CustomerTicketInformation.query.filter(CustomerTicketInformation.description.like('Random problem description%')).all()
    for ticket in test_tickets:
        # Remove user associations with the ticket
        for user in ticket.users:
            ticket.users.remove(user)

        # Delete the ticket
        db.session.delete(ticket)

    db.session.commit()

    return "Test tickets and their user associations deleted successfully"



"""
Loading the landing page : the home page
"""
@views.route('/', methods=['GET', 'POST'])
def home():
    return render_template("landing.html")

"""
Loading the dashboard page
"""
@views.route("/dashboard", methods=['GET'])
@login_required
def dashboard():
    return render_template("dashboard.html")

"""
Loading this page after submitting a ticket
"""
@views.route('/submitted',methods=['GET','POST'])
def submitted():
    return render_template("submitted.html")


"""
will be called when customer or worker create a ticket and hit submit
"""
@views.route('/createTicket',methods=['GET','POST'])
def createTicket():
    if request.method == "POST":
        subject = request.form.get('subject')
        customerFirstName = request.form.get('customer_first_name')
        customerLastName = request.form.get('customer_last_name')
        customerEmail = request.form.get('customer_email')
        businessName = request.form.get('business_name')
        customerNumber = request.form.get('customer_phone')
        problemDescription = request.form.get('description')

        customerInfo = CustomerTicketInformation(id=random.randint(0,10000000000000),
                                                 subject=subject,firstName=customerFirstName,lastName=customerLastName,
                                                 email=customerEmail,businessName=businessName,phoneNumber=customerNumber,
                                                 description=problemDescription)
        
        # Establish a relationship with all admin users based on role
        admin_users = User.query.filter(User.role == 'admin').all()
        
        if admin_users:
            customerInfo.users.extend(admin_users)


        db.session.add(customerInfo)
        db.session.commit()
        
        now = datetime.utcnow()
        date_time = now.strftime("%m/%d/%Y")

        emailToCustomer = sendEmail(businessName,date_time,reciever_email=customerEmail,subject=subject,ticketId=customerInfo.id)
        try:
            emailToCustomer.tickets_recieved_email()
            flash('Ticket created successfully', 'success')
        except Exception as e:
            flash(f'Error sending email: {str(e)}', 'error')
        return redirect(url_for('views.submitted'))
    return render_template("createTicket.html")


"""
the current user who is logged in get their tickets
"""

@views.route("/getCurrentUserTickets",methods=["GET"])
@login_required
def getCurrentUserTickets():

    if current_user.is_authenticated == False:
        return "ERROR"
    
    user = User.query.filter_by(id=current_user.get_id()).first()
    ticketDetails = user.tickets

    curtickets = [{'id': ticket.id , 'subject':ticket.subject,'name':ticket.firstName, 'email':ticket.email,"phoneNumber":ticket.phoneNumber,
                "businessName":ticket.businessName,'date':ticket.date,"status":ticket.status.value,"priority":ticket.priority.value,
                'description':ticket.description} for ticket in ticketDetails]
    
    return jsonify(curtickets)


#Current User Name
@views.route("/getCurrentUserName",methods=["GET"])
@login_required
def getCurrentUserName():

    if current_user.is_authenticated == False:
        return "ERROR"
    
    user = User.query.filter_by(id=current_user.get_id()).first()
    user_name = user.name

    
    return jsonify({'name': user_name})


"""
get all tickets in the database
"""
@views.route("/getAllTickets")
@login_required
def getAllTickets():
    ticketDetails = CustomerTicketInformation.query.all()
    tickets = [{'id': ticket.id , 'subject':ticket.subject,'name':ticket.firstName, 'email':ticket.email,"phoneNumber":ticket.phoneNumber,
                "businessName":ticket.businessName,'date':ticket.date,"status":ticket.status.value,"priority":ticket.priority.value,
                'description':ticket.description} for ticket in ticketDetails]
    return jsonify(tickets)


"""
get all employees in the company
"""
@views.route("/getAllEmployees")
@login_required
def getAllEmployees():
    workers = User.query.all()
    companyWorkers = []

    for worker in workers:
        # Extract ticket information for each employee
        tickets = [{'id': ticket.id, 'subject': ticket.subject, 'status': ticket.status.value} for ticket in worker.tickets]

        # Create a dictionary for each employee
        worker_dict = {
            'id': worker.id,
            'name': worker.name,
            'username': worker.username,
            'role': worker.role,
            'tickets': tickets  # Include ticket information
        }

        companyWorkers.append(worker_dict)

    return jsonify(companyWorkers)


"""
Delete a user from the company 
"""
@views.route("/deleteUser/<int:employee_id>", methods=['DELETE'])
@login_required
def deleteUser(employee_id):
    user = User.query.filter_by(id=employee_id).first()

    if user is not None:
        for ticket in user.tickets:
            ticket.users.remove(user)
        db.session.delete(user)  # Mark the user for deletion
        db.session.commit()  # Commit the transaction
        return jsonify({"message": "User deleted successfully"})
    else:
        return jsonify({"error": "User not found"}, 404)


#added routes for highPriority Ticket
@views.route("/highPriorityTicket/<int:ticket_id>",methods=['POST'])
@login_required
def highPriorityTicket(ticket_id):
    ticket = CustomerTicketInformation.query.get(ticket_id)
    ticket = CustomerTicketInformation.query.get(ticket_id)
    if ticket is None:
        return "Ticket not found", 404
    ticket.priority = priorityOrder.HIGHPRIORITY
    db.session.commit()
    return "Ticket resolved successfully"

#added routes for lowPriority Ticket
@views.route("/lowPriorityTicket/<int:ticket_id>",methods=['POST'])
@login_required
def lowPriorityTicket(ticket_id):
    ticket = CustomerTicketInformation.query.get(ticket_id)
    ticket = CustomerTicketInformation.query.get(ticket_id)
    if ticket is None:
        return "Ticket not found", 404
    ticket.priority = priorityOrder.LOWPRIORITY
    db.session.commit()
    return "Ticket resolved successfully"

"""
change priority of the ticket
"""
@views.route("/changePriority/<int:ticket_id>/<priority>", methods=['POST'])
@login_required
def changeTicketPriority(ticket_id, priority):
    ticket = CustomerTicketInformation.query.get(ticket_id)
    if ticket is None:
        return "Ticket not found", 404

    # Assign the priority based on the received parameter
    if priority == 'highpriority':
        ticket.priority = priorityOrder.HIGHPRIORITY
    elif priority == 'lowpriority':
        ticket.priority = priorityOrder.LOWPRIORITY
    else:
        return "Invalid priority value", 400

    db.session.commit()
    return "Ticket priority updated successfully"


"""
load customer comments page 
"""
@views.route("/customerComments",methods=['GET'])
def customerComments():
    return render_template("customerComments.html")

"""
load admin or company comments page for company 
"""
@views.route("/adminComments",methods=['GET'])
@login_required
def adminComments():
    return render_template('adminComments.html')


# this will return the ticket the main chat messages -- for a particular ticketId
@views.route("/<int:ticket_id>/getMessages")
def getTicketMessagesById(ticket_id):
    ticket = db.session.query(CustomerTicketInformation).filter(CustomerTicketInformation.id == ticket_id).first()
    if ticket:
        # Access the ARRAY of JSON strings
        messages = [{"text": message.text, "sender": message.sender, "timestamp": message.timestamp} for message in ticket.messages]
        return jsonify(messages)
    else:
        return []


#This will get the internal messages for a ticket --> the internal messages are not seen by customers only team members can see those messages
@views.route("/<int:ticket_id>/getInternalMessages")
@login_required
def getInternalMessagesById(ticket_id):
    ticket = db.session.query(CustomerTicketInformation).filter(CustomerTicketInformation.id == ticket_id).first()
    if ticket:
        messages = [{"text": message.text, "sender": message.sender, "timestamp": message.timestamp} for message in ticket.internalMessages]
        return jsonify(messages)
    else:
        return []


#this will get the ticket by their id's
@views.route("/<int:ticket_id>")
def getTicketById(ticket_id):
    ticket = db.session.query(CustomerTicketInformation).filter(CustomerTicketInformation.id == ticket_id).first()
    if ticket is not None:
        ticket_info = {
            'id': ticket.id,
            'subject': ticket.subject,
            'name': ticket.firstName +" "+ ticket.lastName,
            'email': ticket.email,
            'phoneNumber': ticket.phoneNumber,
            'businessName': ticket.businessName,
            'date': ticket.date,
            'status': ticket.status.value,
            'priority': ticket.priority.value,
            'description': ticket.description
        }
        return jsonify(ticket_info)
    else:
        return "Ticket not found", 404


#Post request called when a new main massage is to be submitted to database
@views.route('/submitNewMessage', methods=['POST'])
def submitMessage():
    if request.method == "POST":
        
        message = request.get_json()

        messageText = message.get("text")
        currentSender = message.get("sender")
        currentTime = message.get("timestamp")
        ticketNum = message.get("ticketNum")

        ticket = db.session.query(CustomerTicketInformation).filter(CustomerTicketInformation.id == ticketNum).first()
        if ticket:
            # Create a new message object
            new_message = Message(text=messageText, sender=currentSender, timestamp=currentTime)
            new_message.ticket = ticket
            ticket.messages.append(new_message)

            db.session.commit()

            # Check if the custom header 'X-Page' is present and has the value 'adminComments'
            if request.headers.get('X-Page') == 'adminComments':
                # The request was sent from the "adminComments.html" page #send email update
                emailToCustomer = sendEmail(ticket.businessName,ticket.date,ticket.email,ticket.subject,ticket.id)
                emailToCustomer.adminAddedNewMessage_email()

            return jsonify({"message": "Message added successfully"})
        else:
            return jsonify({"message": "Not a valid ticket number"})

    return jsonify({"message": "Invalid request"})




#this will store the internal comments that customer cannot see, only team members can see those messages
@views.route('/submitNewInternalMessage', methods=['POST'])
@login_required
def submitInternalMessage():
    if request.method == "POST":
        message = request.get_json()

        messageText = message.get("text")
        currentSender = message.get("sender")
        currentTime = message.get("timestamp")
        ticketNum = message.get("ticketNum")

        ticket = db.session.query(CustomerTicketInformation).filter(CustomerTicketInformation.id == ticketNum).first()

        if ticket:
            # Create a new message object
            new_message = InternalMessage(text=messageText, sender=currentSender, timestamp=currentTime)
            new_message.ticket = ticket
            ticket.internalMessages.append(new_message)

            db.session.commit()

            return jsonify({"message": "Message added successfully"})
        else:
            return jsonify({"message": "Not a valid ticket number"})

    return jsonify({"message": "Invalid request"})

"""
get the status of the ticket if it is resolved or unresolved
"""
@views.route("/<int:ticket_id>/getStatus")
def getStatusById(ticket_id):
    ticket = db.session.query(CustomerTicketInformation).filter(CustomerTicketInformation.id == ticket_id).first()
    if ticket:
        # Access the ARRAY of JSON strings
        if(ticket.status == statusEnum.RESOLVED):
            status = {"status" : 1 }
        else:
           status = {"status" : 0 } 
           
        return jsonify(status)
    else:
        return []

"""
If there is any status change requested
"""
@views.route('/statusChange', methods=['POST'])
@login_required
def submitStatusChange():
    if request.method == "POST":
        message = request.get_json()  

        messageText = message.get("text")
        currentSender = message.get("sender")
        currentTime = message.get("timestamp")
        ticketNum = message.get("ticketNum") 
        ticketStatus = message.get("status") 
        
        ticket = db.session.query(CustomerTicketInformation).filter(CustomerTicketInformation.id == ticketNum).first()

        if ticket:
            # Create a new message object
            new_message = Message(text=messageText, sender=currentSender, timestamp=currentTime)
            new_message.ticket = ticket
            ticket.messages.append(new_message)

            if(ticketStatus == "Resolved"):
                ticket.status = statusEnum.RESOLVED
                if(ticket.priority != priorityOrder.NONE):
                    ticket.priority = priorityOrder.NONE
            else:
                ticket.status = statusEnum.UNRESOLVED

            db.session.commit()
            # Check if the custom header 'X-Page' is present and has the value 'adminComments'
            if request.headers.get('X-Page') == 'adminComments':
                # The request was sent from the "adminComments.html" page #send email update
                emailToCustomer = sendEmail(ticket.businessName,ticket.date,ticket.email,ticket.subject,ticket.id)
                emailToCustomer.adminAddedNewMessage_email()

            return jsonify({"message": "Message added successfully"})
        else:
            return jsonify({"message": "Not a valid ticket number"})

    return jsonify({"message": "Invalid request"})



#Assigning user Routes
@views.route('/assignTicket/<int:ticketId>/<int:employeeId>',methods=['POST','GET'])
@login_required
def assignTicket(ticketId,employeeId):
    ticket = CustomerTicketInformation.query.get(ticketId)
    employee = User.query.get(employeeId)
    if (employee and ticket is None):
        return "Invalid employee or ticket", 404
    if employee in ticket.users:
        return "Employee is already assigned to the ticket",400
    
    ticket.users.append(employee)
    db.session.commit()
    return "Ticket assigned successfully"

"""
get assigned user
"""
@views.route('/getAssignedUsers/<int:ticketId>',methods=['GET','POST']) #/getAssignedUsers/${ticketId}
@login_required
def getAssignedUsers(ticketId):
    ticket = CustomerTicketInformation.query.get(ticketId)
    if (ticket is None):
        return "Invalid ticket", 404
    
    assigned_users = [{'name': user.name} for user in ticket.users]
    
    return jsonify(assigned_users)
