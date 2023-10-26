#Will have all classes for database#

from . import db
from sqlalchemy.sql import func
from sqlalchemy import Column , Enum
from enum import Enum as EnumBase
from flask_login import UserMixin


#priority for status of my tickets
class statusEnum(EnumBase):
    RESOLVED = "resolved"
    UNRESOLVED = "unresolved"


#Enum for my priority of the tickets
class priorityOrder(EnumBase):
    HIGHPRIORITY = "highpriority"
    LOWPRIORITY = "lowpriority"
    NONE = "none"

class CusomterTickerInformation(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    subject = db.Column(db.String(150))
    firstName = db.Column(db.String(150))
    lastName = db.Column(db.String(150))
    email = db.Column(db.String(150))
    businessName = db.Column(db.String(150))
    phoneNumber = db.Column(db.String(20))
    description = db.Column(db.String(500))
    status = Column(Enum(statusEnum),default=statusEnum.UNRESOLVED)
    priority = Column(Enum(priorityOrder),default=priorityOrder.NONE)
    date = db.Column(db.DateTime(timezone=True), default=func.now())


class User(UserMixin,db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    role = db.Column(db.String(100))


class sendEmail:
    def __init__(self,businessName,date,reciever_email,subject):
        self.businessName = businessName
        self.date = date
        self.email = reciever_email
        self.link = "login.html"
        self.subject = subject

    def tickets_recieved_email(self):
        self.msg = MIMEMultipart()
        self.msg['From'] = smtp_username
        self.msg['To'] = self.email
        self.msg['Subject'] = "Ticket Recieved"
        self.html = """<html>
                <body>
                    <p> Greetings """ + self.businessName + """, <br>
                        We have received your ticket on """ + self.date + """ regarding the following subject:<br>""" + self.subject + """<br>
                        Please use the following information when referencing your request:<br>
                        Ticket ID : <a href=""" + self.link + """>Ticket ID</a><br>
                        We will resolve this issue as soon as possible.
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