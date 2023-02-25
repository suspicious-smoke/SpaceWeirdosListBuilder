from flask import abort, current_app, render_template


def home_page():
    db = current_app.config["db"]
    warbands = db.get_warbands()
    return render_template('home.html', warbands=sorted(warbands))


def warband_page(warband_key):
    db = current_app.config["db"]
    warband = db.get_warband(warband_key)
    # if warband does not exist, return 404 error
    if warband is None:
        abort(404)
    # will want to pass all the weirdos as well later on
    return render_template('warband.html', warband=warband)


# def weirdo_page():
#     return render_template('weirdo.html')
