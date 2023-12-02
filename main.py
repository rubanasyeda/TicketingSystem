#From this file is where our webserver will run
from website import create_app



app = create_app()


if (__name__) == '__main__':
    app.run(debug=True)