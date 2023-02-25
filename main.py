from flask import Flask
import views
from models import Database, Warband


def create_app():
    _app = Flask(__name__)
    _app.config.from_object("settings")  # Loads the settings from settings.py

    _app.add_url_rule("/", view_func=views.home_page)
    _app.add_url_rule("/warband/<int:warband_key>", view_func=views.warband_page)

    # _app.add_url_rule("/weirdo/<int:weirdo_key>", view_func=views.weirdo_page)

    db = Database()
    db.add_warband(Warband("Chaos", warband_trait="Unrelenting"))
    db.add_warband(Warband("Order"))
    _app.config["db"] = db

    return _app


if __name__ == "__main__":
    app = create_app()
    port = app.config.get("PORT", 5000)
    app.run(host="0.0.0.0", port=port)
