from flask import Flask
from flask import render_template, request

def create_app():
    _app = Flask(__name__)
    _app.config.from_object("settings")  # Loads the settings from settings.py

    @_app.route("/")
    def home_page():
        return render_template('home.html')

    @_app.route("/warband")
    def warband_page():
        warband_id = request.args.get("warband_id", default=0, type=int)
        return render_template("warband.html", warband_id=warband_id)

    @_app.route("/print_warband")
    def print_warband_page():
        warband_id = request.args.get("warband_id", default=0, type=int)
        return render_template("print_warband.html", warband_id=warband_id)

    return _app


app = create_app()


if __name__ == "__main__":
    port = app.config.get("PORT", 5000)
    app.run(host="0.0.0.0", port=port)
