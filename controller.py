import datetime
from flask import jsonify, render_template, request, make_response, redirect, url_for
from models import Warband

max_age = datetime.timedelta(days=365 * 10)
# Connects to the warbands page
def home_page():
    # db = current_app.config["db"]
    if request.method == "GET":
        # if response:
        #     token = request.get_json()['token']
        # Get the warbands and return warbands page
        # w = Warband('test_name','Mutants')
        # response = make_response(render_template('home.html', warband = w))
        response = make_response(render_template('home.html'))
        response.set_cookie('test_cookie','cookie_val',max_age=max_age)

        return response
    else:  # POST
        # warband_name = request.form["warband_name"]
        # warband_trait = request.form["warband_trait"]
        data = request.get_json()  # Parse JSON data from the request body
        print(f"Received data: {data}")
        # return jsonify({"message": "Data received successfully", "received_data": data})

        return redirect(url_for("home_page"), warband_id='')

