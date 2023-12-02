from flask import Blueprint,render_template,request,redirect,url_for
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db
from flask_login import login_user,login_required, current_user, logout_user

auth = Blueprint('auth',__name__)


#test route (this route is not used within regular activity flow)
@auth.route('/generateTestUsers', methods=['GET'])
def generate_test_users():
    # Check if the current user is authenticated and an admin
    if not current_user.is_authenticated or current_user.role != "admin":
        return redirect(url_for('auth.login'))

    # Get the number of users to generate
    num_users = 10

    # Find the last generated test user
    last_test_user = User.query.filter(User.username.like('test_user%')).order_by(User.id.desc()).first()

    # Determine the starting index for the new test users
    if last_test_user:
        last_index = int(last_test_user.username.replace('test_user', ''))
        start_index = last_index + 1
    else:
        start_index = 0

    # Generate random users with passwords
    for i in range(start_index, start_index + num_users):
        name = f"Test User {i}"
        username = f"test_user{i}"
        password = f"password{i}"
        role = "user"  # You can adjust the role as needed

        # Check if the username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            continue

        new_user = User(
            name=name,
            username=username,
            password=generate_password_hash(password, method='sha256'),
            role=role
        )

        db.session.add(new_user)

    db.session.commit()

    return f"{num_users} test users generated successfully"


#test route (this route is not used within regular activity flow)
@auth.route('/deleteTestUsers', methods=['GET'])
def delete_test_users():
    # Check if the current user is authenticated and an admin
    if not current_user.is_authenticated or current_user.role != "admin":
        return redirect(url_for('auth.login'))

    # Find and delete all test users
    test_users = User.query.filter(User.username.like('test_user%')).all()
    for user in test_users:
        # Remove relationships to tickets
        for ticket in user.tickets:
            ticket.users.remove(user)

        # Delete the user
        db.session.delete(user)

    db.session.commit()

    return "Test users and their relationships deleted successfully"


@auth.route('/admin-dashboard', methods=['GET','POST'])
def admin():
    if request.method == 'GET':

        if current_user.is_authenticated == False:
            return redirect(url_for('auth.login'))

        user = User.query.filter_by(id=current_user.get_id()).first()
        if user.role == "admin":
            return render_template("admin.html")
        
        return redirect(url_for('views.home'))


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


"""
Please use logout to end a session
"""

@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('views.home'))