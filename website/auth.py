#will have all the routes for authorization pages#
from flask import Blueprint,render_template,request,redirect,url_for

auth = Blueprint('auth',__name__)
