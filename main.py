#From this file is where our webserver will run
from website import create_app


#To initialize our app and run it
app = create_app()


if (__name__) == '__main__':
    app.run(debug=True)