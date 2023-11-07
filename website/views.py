#will have all the routes for pages that does not have authorization#

from flask import Blueprint,render_template,request,redirect,url_for,jsonify
from datetime import datetime
from . import db
from .models import CustomerTicketInformation,sendEmail,User
from .models import statusEnum,priorityOrder

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    return render_template("landing.html")

@views.route("/dashboard",methods=['GET'])
def dashboard():
    return render_template("dashboard.html")

@views.route('/submitted',methods=['GET','POST'])
def submitted():
    return render_template("submitted.html")


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

        customerInfo = CustomerTicketInformation(subject=subject,firstName=customerFirstName,lastName=customerLastName,
                                                 email=customerEmail,businessName=businessName,phoneNumber=customerNumber,
                                                 description=problemDescription)
        db.session.add(customerInfo)
        db.session.commit()
        now = datetime.now()
        date_time = now.strftime("%m/%d/%Y")
        emailToCustomer = sendEmail(businessName,date_time,reciever_email=customerEmail,subject=subject)
        emailToCustomer.tickets_recieved_email()
        return redirect(url_for('views.submitted'))
    return render_template("createTicket.html")





@views.route("/getAllTickets")
def getAllTickets():
    ticketDetails = CustomerTicketInformation.query.all()
    tickets = []

    for ticket in ticketDetails:
        # Extract user information for each ticket
        users = [{'id': user.id, 'name': user.name, 'username': user.username, 'role': user.role} for user in ticket.users]

        # Create a dictionary for each ticket
        ticket_dict = {
            'id': ticket.id,
            'subject': ticket.subject,
            'name': ticket.firstName,
            'email': ticket.email,
            'phoneNumber': ticket.phoneNumber,
            'businessName': ticket.businessName,
            'date': ticket.date.strftime("%Y-%m-%d %H:%M:%S"),
            'status': ticket.status.value,
            'priority': ticket.priority.value,
            'description': ticket.description,
            'users': users  # Include user information
        }

        tickets.append(ticket_dict)

    return jsonify(tickets)


@views.route("/getAllEmployees")
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








@views.route("/deleteUser/<int:employee_id>", methods=['DELETE'])
def deleteUser(employee_id):
    user = User.query.filter_by(id=employee_id).first()

    if user is not None:
        db.session.delete(user)  # Mark the user for deletion
        db.session.commit()  # Commit the transaction
        return jsonify({"message": "User deleted successfully"})
    else:
        return jsonify({"error": "User not found"}, 404)


#route created for resolveTicket
@views.route("/resolveTicket/<int:ticket_id>",methods=['POST'])
def resolveTicket(ticket_id):
    ticket = CustomerTicketInformation.query.get(ticket_id)
    if ticket is None:
        return "Ticket not found", 404
    ticket.status = statusEnum.RESOLVED
    ticket.priority = priorityOrder.NONE
    db.session.commit()
    return "Ticket resolved successfully"

#added routes for unresolve Ticket
@views.route("/unresolveTicket/<int:ticket_id>",methods=['POST'])
def unresolveTicket(ticket_id):
    ticket = CustomerTicketInformation.query.get(ticket_id)
    if ticket is None:
        return "Ticket not found", 404
    ticket.status = statusEnum.UNRESOLVED
    db.session.commit()
    return "Ticket resolved successfully"

#added routes for highPriority Ticket
@views.route("/highPriorityTicket/<int:ticket_id>",methods=['POST'])
def highPriorityTicket(ticket_id):
    ticket = CustomerTicketInformation.query.get(ticket_id)
    if ticket is None:
        return "Ticket not found", 404
    ticket.priority = priorityOrder.HIGHPRIORITY
    db.session.commit()
    return "Ticket resolved successfully"

#added routes for lowPriority Ticket
@views.route("/lowPriorityTicket/<int:ticket_id>",methods=['POST'])
def lowPriorityTicket(ticket_id):
    ticket = CustomerTicketInformation.query.get(ticket_id)
    if ticket is None:
        return "Ticket not found", 404
    ticket.priority = priorityOrder.LOWPRIORITY
    db.session.commit()
    return "Ticket resolved successfully"

#completed the changing the status and the priority of the tickets


@views.route("/assignEmployeesToTicket/<int:ticket_id>", methods=['POST'])
def assign_employees_to_ticket(ticket_id):
    ticket = CustomerTicketInformation.query.get(ticket_id)
    if ticket is None:
        return "Ticket not found", 404

    data = request.get_json()
    employee_ids = data.get('employeeIds', [])

    # Clear existing associations and add the new ones
    ticket.users = []
    for employee_id in employee_ids:
        employee = User.query.get(employee_id)
        if employee:
            ticket.users.append(employee)

    db.session.commit()
    return "Employees assigned to the ticket successfully"


@views.route("/removeEmployeesFromTicket/<int:ticket_id>", methods=['POST'])
def remove_employees_from_ticket(ticket_id):
    ticket = CustomerTicketInformation.query.get(ticket_id)
    if ticket is None:
        return "Ticket not found", 404

    data = request.get_json()
    employee_ids = data.get('employeeIds', [])

    # Remove the specified employees from the ticket
    for employee_id in employee_ids:
        employee = User.query.get(employee_id)
        if employee and employee in ticket.users:
            ticket.users.remove(employee)

    db.session.commit()
    return "Employees removed from the ticket successfully"
