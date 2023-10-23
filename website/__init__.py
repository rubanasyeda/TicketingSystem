#This will make our wesbite folder as package#

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
DB_NAME = "database.db"

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "Team_43_CMPT_370"
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    create_database(app)
    return app

    return app


def create_database(app):
    with app.app_context():
        db.create_all()
    print("Database Created!!")