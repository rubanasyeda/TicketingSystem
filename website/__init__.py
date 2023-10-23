#This will make our wesbite folder as package#

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "Team_43_CMPT_370"
    return app