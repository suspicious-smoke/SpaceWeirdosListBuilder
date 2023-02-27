from flask import abort, current_app, render_template, request, url_for, redirect

from database import Warband


# Connects to the warbands page
def warbands_page():
    db = current_app.config["db"]
    if request.method == "GET":
        # Get the warbands and return warbands page
        warbands = db.get_warbands()
        return render_template('warbands.html', warbands=sorted(warbands))
    else:  # POST
        # the only post for the homepage is in removing warbands.
        form_warband_keys = request.form.getlist("warband_keys")
        for key in form_warband_keys:
            db.delete_warband(int(key))
        return redirect(url_for("warbands_page"))


# called either from the main warbands page or the specific key is given in the url
def warband_page(warband_key):
    db = current_app.config["db"]
    warband = db.get_warband(warband_key)
    # if warband does not exist, return 404 error
    if warband is None:
        abort(404)
    # will want to pass all the weirdos as well later on
    return render_template('warband.html', warband=warband)


# called from the warband page. Either gets the warband selected
def warband_add_page():
    if request.method == "GET":
        values = {"name": "", "warband_trait": ""}
        return render_template("warband_edit.html", values=values)
    else:  # post = saving the warband.
        valid = validate_warband_form(request.form)
        if not valid:
            # if not valid, return the form
            return render_template("warband_edit.html", values=request.form)

        _name = request.form["name"]
        _warband_trait = request.form["warband_trait"]
        warband = Warband(_name, warband_trait=_warband_trait if _warband_trait else None)
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
    else:  # post
        valid = validate_warband_form(request.form)
        if not valid:
            return render_template("warband_edit.html", values=request.form)

        form_name = request.form["name"]
        form_warband_trait = request.form["warband_trait"]
        warband = Warband(form_name, warband_trait=form_warband_trait if form_warband_trait else None)
        db.update_warband(warband_key, warband)
        return redirect(url_for("warband_page", warband_key=warband_key))

# def weirdo_page():
#     return render_template('weirdo.html')


def validate_warband_form(form):
    form.data = {}
    form.errors = {}

    _name = form.get("name", "").strip()
    if len(_name) == 0:
        form.errors["name"] = "Name can not be blank."
    else:
        form.data["name"] = _name

    # form_year = form.get("warband_trait")
    # if not form_year:
    #     form.data["warband_trait"] = None
    # elif not form_year.isdigit():
    #     form.errors["warband_trait"] = "warband trait must consist of digits only."
    # else:
    #     year = int(form_year)
    #     if (year < 1887) or (year > datetime.now().year):
    #         form.errors["year"] = "Year not in valid range."
    #     else:
    #         form.data["year"] = year

    return len(form.errors) == 0
