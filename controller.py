import datetime
from flask import jsonify, render_template, request, make_response, redirect, url_for
from models import *

max_age = datetime.timedelta(days=365 * 10)
# Connects to the warbands page
def home_page():
    return make_response(render_template('home.html'))

# def get_weirdo(warband_id,weirdo_id=0):
#     weirdo = Weirdo(warband_id,weirdo_id,name="successful test").serialize()
#     # model = next((m for m in models if m["id"] == weirdo_id), None)
#     # if model:
#     #     return jsonify(model)
#     return jsonify(weirdo)
#     # return jsonify({"error": "Model not found"}), 404


# load warband page
def warband_page(warband_id):
    # get warband id and selects
    _warband = Warband(warband_id)
    return make_response(render_template('warband.html', warband = _warband))


# load warband page
def warband_points():
    # get warband id and selects
    warband = request.get_json()
    points = 0
    weirdo_points_list = []
    for weirdo in warband['weirdos']:
        weirdo_pts = speed[weirdo['speed']] + defense[weirdo['defense']]
        points += weirdo_pts
        weirdo_info = {'id': weirdo['weirdo_id'], 'points':weirdo_pts }
        weirdo_points_list.append(weirdo_info)
    # Return the result as JSON
    return jsonify({"points": points, "weirdos": weirdo_points_list})
