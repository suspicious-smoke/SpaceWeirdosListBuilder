from flask import render_template, request, make_response, redirect, url_for
from models import Warband

# Connects to the warbands page
def home_page():
    # db = current_app.config["db"]
    if request.method == "GET":
        # Get the warbands and return warbands page
        # c = cookies.setcookie()
        w = Warband('test_name','Mutants')
        return render_template('home.html', warband = w)
    else:  # POST
        warband_name = request.form["warband_name"]
        warband_trait = request.form["warband_trait"]
       
        

        return redirect(url_for("home_page"), warband_id='')
