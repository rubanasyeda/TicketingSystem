from flask import Blueprint,render_template,request,redirect,url_for
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db
from flask_login import login_user,login_required, current_user, logout_user

auth = Blueprint('auth',__name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get("username")
        password = request.form.get("password")
        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password, password):
            return redirect(url_for('auth.login'))
        login_user(user, remember=True)
        return redirect(url_for('views.dashboard'))
    return render_template("login.html")


@auth.route('/signup',methods=['GET', 'POST'])
@login_required  # remove if no inital acocunt is in data base
def signup():
    
    if current_user.is_authenticated == False:
        return redirect(url_for('auth.login'))

    user = User.query.filter_by(id=current_user.get_id()).first()
    if user.role == "admin":

        if request.method == 'POST':
            name = request.form.get("name")
            username = request.form.get("username")
            password = request.form.get("password")
            role = request.form.get("role")
            user = User.query.filter_by(username=username).first()
            if user:
                return redirect(url_for('auth.signup'))
            new_user = User(name=name, username=username, password=generate_password_hash(password, method='sha256'),
                            role=role)

            db.session.add(new_user)
            db.session.commit()

            return redirect(url_for('auth.login'))
    
        return render_template('signup.html')


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('views.home'))