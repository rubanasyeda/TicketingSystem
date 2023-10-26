#will have all the routes for pages that does not have authorization#

from flask import Blueprint,render_template,request,redirect,url_for,jsonify
from datetime import datetime
from . import db
from .models import CusomterTickerInformation,sendEmail

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    return render_template("landing.html")

@views.route("/dashboard",methods=['GET'])
def dashboard():
    return render_template("dashboard.html")

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

        customerInfo = CusomterTickerInformation(subject=subject,firstName=customerFirstName,lastName=customerLastName,
                                                 email=customerEmail,businessName=businessName,phoneNumber=customerNumber,
                                                 description=problemDescription)
        db.session.add(customerInfo)
        db.session.commit()
        now = datetime.now()
        date_time = now.strftime("%m/%d/%Y")
        emailToCustomer = sendEmail(businessName,date_time,reciever_email=customerEmail,subject=subject)
        emailToCustomer.tickets_recieved_email()
        return redirect(url_for('views.home'))
    return render_template("createTicket.html")

@views.route("/getAllTickets")
def getAllTickets():
    ticketDetails = CusomterTickerInformation.query.all()
    tickets = [{'id': ticket.id , 'subject':ticket.subject,'name':ticket.firstName, 'email':ticket.email,"phoneNumber":ticket.phoneNumber,
                "businessName":ticket.businessName,'date':ticket.date,"status":ticket.status.value,"priority":ticket.priority.value,
                'description':ticket.description} for ticket in ticketDetails]
    return jsonify(tickets)
    #route that will pass all tickets that are in database -- so that front end people can use that in javascript
