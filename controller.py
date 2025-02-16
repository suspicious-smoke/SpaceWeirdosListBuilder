import datetime
from flask import jsonify, render_template, request, make_response, redirect, url_for
from models import *


# Connects to the warbands page
def home_page():
    return make_response(render_template('home.html'))


# load warband page
def warband_page(warband_id):
    return make_response(render_template('warband.html', warband_id = warband_id))


def print_warband_page(warband_id):
    return make_response(render_template('print_warband.html', warband_id = warband_id))