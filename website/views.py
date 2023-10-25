#will have all the routes for pages that does not have authorization#

from flask import Blueprint,render_template,request,redirect,url_for,jsonify
from datetime import datetime
from . import db

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    return render_template("landing.html")