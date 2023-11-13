smtp_server = 'smtp.office365.com'  # for Microsoft 365
smtp_port = 587
smtp_username = 'TRTticketsystem@outlook.com'  # Your Outlook email address
smtp_password = 'ibdhs13jd82'  # Your Outlook password

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from . import db
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.sql import func
from flask_login import UserMixin
from sqlalchemy import Column , Enum, String, JSON, ForeignKey,Integer
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

from enum import Enum as EnumBase


#priority for status of my tickets
class statusEnum(EnumBase):
    RESOLVED = "resolved"
    UNRESOLVED = "unresolved"

#Enum for my priority of the tickets
class priorityOrder(EnumBase):
    HIGHPRIORITY = "highpriority"
    LOWPRIORITY = "lowpriority"
    NONE = "none"

# Message object representing each message sent for a ticket in the Database
class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String)  # Assuming 'text' is a string
    sender = db.Column(db.String)
    timestamp = db.Column(db.String)
    ticket_id = db.Column(db.Integer, db.ForeignKey("customer_ticket_information.id"))
    ticket = db.relationship("CustomerTicketInformation", back_populates="messages")

# InternalMessage object representing each internal message sent for a ticket in the Database
class InternalMessage(db.Model):
    __tablename__ = "internal_messages"

    id = db.Column(Integer, primary_key=True)
    text = db.Column(JSON)  # JSON column for message data
    sender = db.Column(db.String)
    timestamp = db.Column(db.String)
    ticket_id = db.Column(Integer, ForeignKey("customer_ticket_information.id"))
    ticket = relationship("CustomerTicketInformation", back_populates="internalMessages")

# Object representing each Ticket in the database
class CustomerTicketInformation(db.Model):
    __tablename__ = "customer_ticket_information"
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(150))
    firstName = db.Column(db.String(150))
    lastName = db.Column(db.String(150))
    email = db.Column(db.String(150))
    businessName = db.Column(db.String(150))
    phoneNumber = db.Column(db.String(20))
    description = db.Column(db.String(500))
    status = Column(Enum(statusEnum), default=statusEnum.UNRESOLVED)
    priority = Column(Enum(priorityOrder), default=priorityOrder.NONE)
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    messages = relationship("Message", back_populates="ticket")
    internalMessages = relationship("InternalMessage", back_populates="ticket")

# Object to represent each user account created
class User(UserMixin,db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    role = db.Column(db.String(100))

# Object to send email upon submitted ticket
class sendEmail:
    def __init__(self,businessName,date,reciever_email,subject,ticketId):
        self.businessName = businessName
        self.ticketId = ticketId
        self.date = date
        self.email = reciever_email
        self.link = f"http://127.0.0.1:5000/customerComments?ticketId={ticketId}"
        self.subject = subject


    def tickets_recieved_email(self):
        self.msg = MIMEMultipart()
        self.msg['From'] = smtp_username
        self.msg['To'] = self.email
        self.msg['Subject'] = "Ticket Recieved"
        self.html = f"""<html>
                        <body>
                            <p> Greetings {self.businessName}, <br><br>
                                We have received your ticket on {self.date} regarding the following subject:<br>{self.subject}<br><br>
                                Please use the following information when referencing your request:<br>
                                Ticket ID : <a href="{self.link}">{self.ticketId}</a><br><br>
                                We will resolve this issue as soon as possible.<br><br> 
                                Regards,<br> TRT Support
                            </p>
                        </body>
                        </html>
                    """
        self.msg.attach(MIMEText(self.html, 'html'))
        try:
            self.server = smtplib.SMTP(smtp_server, smtp_port)
            self.server.starttls()  # Use STARTTLS for encryption
            self.server.login(smtp_username, smtp_password)

            # Send the email
            self.server.sendmail(smtp_username, self.email, self.msg.as_string())
            print("Email sent successfully!")
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        finally:
            self.server.quit()
    
    def adminAddedNewMessage_email(self):
        self.msg = MIMEMultipart()
        self.msg['From'] = smtp_username
        self.msg['To'] = self.email
        self.msg['Subject'] = f"Update on Ticket ID: {self.ticketId}" 
        self.html = f"""<html>
                        <body>
                            <p> Greetings {self.businessName}, <br><br>
                                A new comment has been added to your ticket regarding the following subject:<br>{self.subject}<br><br>
                                Please use the following information when referencing your request:<br>
                                Ticket ID : <a href="{self.link}">{self.ticketId}</a><br><br>
                                Regards,<br> TRT Support
                            </p>
                        </body>
                        </html>
                    """
        self.msg.attach(MIMEText(self.html, 'html'))
        try:
            self.server = smtplib.SMTP(smtp_server, smtp_port)
            self.server.starttls()  # Use STARTTLS for encryption
            self.server.login(smtp_username, smtp_password)

            # Send the email
            self.server.sendmail(smtp_username, self.email, self.msg.as_string())
            print("Email sent successfully!")
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        finally:
            self.server.quit()

    def statusChange(self):
        self.msg = MIMEMultipart()
        self.msg['From'] = smtp_username
        self.msg['To'] = self.email
        self.msg['Subject'] = f"Update on Ticket ID: {self.ticketId}" 
        self.html = f"""<html>
                        <body>
                            <p> Greetings {self.businessName}, <br><br>
                                There has been a Status change to your ticket regarding the following subject:<br>{self.subject}<br><br>
                                Please use the following information when referencing your request:<br>
                                Ticket ID : <a href="{self.link}">{self.ticketId}</a><br><br>
                                Regards,<br> TRT Support
                            </p>
                        </body>
                        </html>
                    """
        self.msg.attach(MIMEText(self.html, 'html'))
        try:
            self.server = smtplib.SMTP(smtp_server, smtp_port)
            self.server.starttls()  # Use STARTTLS for encryption
            self.server.login(smtp_username, smtp_password)

            # Send the email
            self.server.sendmail(smtp_username, self.email, self.msg.as_string())
            print("Email sent successfully!")
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        finally:
            self.server.quit()    
        

