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


def print_warband_page(warband_id):
    # get warband id and selects
    _warband = Warband(warband_id)
    return make_response(render_template('print_warband.html', warband = _warband))


# gets point value for given item equiped to weirdo
def item_points(item_list, weirdo_item):
    for item in item_list:
            if item['name'] == weirdo_item:
                return item['points']
    return 0


def get_trait_text():
    traits = request.get_json()
    wt_text = ''
    lt_text = ''
    for key, value in warband_traits.items():
        if key == traits[0]:
            wt_text = value

    for key, value in leader_traits.items():
        if key == traits[1]:
            lt_text = value
    
    return jsonify({"wt_text": wt_text, "lt_text": lt_text})

# load warband page
def warband_points():
    # get warband id and selects
    warband = request.get_json()
    points = 0
    weirdo_points_list = []
    for weirdo in warband['weirdos']:
        weirdo_pts = speed[weirdo['speed']] + defense[weirdo['defense']] + firepower[weirdo['firepower']] + prowess[weirdo['prowess']] + willpower[weirdo['willpower']]
        
        if 'ranged_weapon' in weirdo:
            weirdo_pts += item_points(ranged_weapons, weirdo['ranged_weapon'])
        if 'melee_weapon' in weirdo:
            weirdo_pts += item_points(melee_weapons, weirdo['melee_weapon'])
        
        if 'equipment' in weirdo:
            for equip in weirdo['equipment']:
                weirdo_pts += item_points(equipment, equip)
        
        if 'powers' in weirdo:
            for power in weirdo['powers']:
                weirdo_pts += item_points(powers, power)

        points += weirdo_pts
        weirdo_info = {'id': weirdo['weirdo_id'], 'points':weirdo_pts }
        weirdo_points_list.append(weirdo_info)
    # Return the result as JSON
    return jsonify({"points": points, "weirdos": weirdo_points_list})

