#Will have all classes for database#

from . import db
from sqlalchemy.sql import func
from sqlalchemy import Column , Enum
from enum import Enum as EnumBase

#priority for status of my tickets
class statusEnum(EnumBase):
    RESOLVED = "resolved"
    UNRESOLVED = "unresolved"

