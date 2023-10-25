#Will have all classes for database#

from . import db
from sqlalchemy.sql import func
from sqlalchemy import Column , Enum
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