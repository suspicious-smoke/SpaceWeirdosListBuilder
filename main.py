import os
from flask import Flask
import controller
from database import Database


def create_app():
    _app = Flask(__name__)
    _app.config.from_object("settings")  # Loads the settings from settings.py

    # load up and connect each webpage to their views
    _app.add_url_rule("/", view_func=controller.home_page, methods=["GET", "POST"])

    # _app.add_url_rule('/get_data',view_func=controller.get_data, methods=["GET", "POST"])

    # _app.add_url_rule("/create-warband", view_func=controller.warband_create_page, methods=["GET", "POST"])
    return _app


if __name__ == "__main__":
    app = create_app()
    port = app.config.get("PORT", 5000)
    app.run(host="0.0.0.0", port=port)
