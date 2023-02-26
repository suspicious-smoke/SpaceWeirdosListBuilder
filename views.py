from flask import abort, current_app, render_template, request, url_for, redirect

from models import Warband


def warbands_page():
    db = current_app.config["db"]
    if request.method == "GET":
        warbands = db.get_warbands()
        return render_template('warbands.html', warbands=sorted(warbands))
    else:
        form_warband_keys = request.form.getlist("warband_keys")
        for key in form_warband_keys:
            db.delete_warband(int(key))
        return redirect(url_for("warbands_page"))


def warband_page(warband_key):
    db = current_app.config["db"]
    warband = db.get_warband(warband_key)
    # if warband does not exist, return 404 error
    if warband is None:
        abort(404)
    # will want to pass all the weirdos as well later on
    return render_template('warband.html', warband=warband)


def warband_add_page():
    if request.method == "GET":
        values = {"name": "", "warband_trait": ""}
        return render_template("warband_edit.html", values=values)
    else:
        form_name = request.form["name"]
        form_warband_trait = request.form["warband_trait"]
        warband = Warband(form_name, warband_trait=form_warband_trait if form_warband_trait else None)
        db = current_app.config["db"]
        warband_key = db.add_warband(warband)
        return redirect(url_for("warband_page", warband_key=warband_key))  # Call the above warband url


def warband_edit_page(warband_key):
    db = current_app.config["db"]
    if request.method == "GET":
        warband = db.get_warband(warband_key)
        if warband is None:
            abort(404)
        values = {"name": warband.name, "warband_trait": warband.warband_trait}
        return render_template("warband_edit.html", values=values)
    else:
        form_name = request.form["name"]
        form_warband_trait = request.form["warband_trait"]
        warband = Warband(form_name, warband_trait=form_warband_trait if form_warband_trait else None)
        db.update_warband(warband_key, warband)
        return redirect(url_for("warband_page", warband_key=warband_key))

# def weirdo_page():
#     return render_template('weirdo.html')
