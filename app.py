import os
from flask import Flask
import controller


def create_app():
    _app = Flask(__name__)
    _app.config.from_object("settings")  # Loads the settings from settings.py

    # load up and connect each webpage to their views
    _app.add_url_rule("/", view_func=controller.home_page, methods=["GET"])
    _app.add_url_rule("/warband/<int:warband_id>", view_func=controller.warband_page, methods=["GET"])
    _app.add_url_rule("/get_warband_points/", view_func=controller.warband_points, methods=["POST"])
    _app.add_url_rule("/print_warband/<int:warband_id>", view_func=controller.print_warband_page, methods=["GET"])
    return _app

app = create_app()

if __name__ == "__main__":
    port = app.config.get("PORT", 5000)
    app.run(host="0.0.0.0", port=port)
