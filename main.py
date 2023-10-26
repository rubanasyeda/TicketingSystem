#From this file is where our webserver will run
from website import create_app, db
from website.models import User, CusomterTickerInformation
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user

class MyModelView(ModelView):
    can_create = False

    def is_accessible(self):
        if current_user.is_authenticated:
            user = User.query.filter_by(id=current_user.get_id()).first()
            return user.role == "admin"
        else:
            return False

class MyAdminIndexView(AdminIndexView):

    def is_accessible(self):
        if current_user.is_authenticated:
            user = User.query.filter_by(id=current_user.get_id()).first()
            return user.role == "admin"
        else:
            return False

app = create_app()
app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'

admin = Admin(app, index_view=MyAdminIndexView())
admin.add_view(MyModelView(User, db.session))
admin.add_view(MyModelView(CusomterTickerInformation, db.session))

if (__name__) == '__main__':
    app.run(debug=True)