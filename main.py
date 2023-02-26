import os

from flask import Flask
import views
from datastructure import Database, Warband


def create_app():
    _app = Flask(__name__)
    _app.config.from_object("settings")  # Loads the settings from settings.py

    _app.add_url_rule("/", view_func=views.warbands_page, methods=["GET", "POST"])

    _app.add_url_rule("/edit-warband", view_func=views.warband_add_page, methods=["GET", "POST"])
    _app.add_url_rule("/warband/<int:warband_key>", view_func=views.warband_page)

    _app.add_url_rule("/warband/<int:warband_key>/edit", view_func=views.warband_edit_page, methods=["GET", "POST"])
    # _app.add_url_rule("/weirdo/<int:weirdo_key>", view_func=views.weirdo_page)

    home_dir = os.path.expanduser("~")
    db = Database(os.path.join(home_dir, "warbands.sqlite"))
    _app.config["db"] = db

    return _app


if __name__ == "__main__":
    app = create_app()
    port = app.config.get("PORT", 5000)
    app.run(host="0.0.0.0", port=port)
