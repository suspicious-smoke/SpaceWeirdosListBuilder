import logic as h
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/", methods=['GET'])
def index():
    return render_template('test.html')


@app.route('/result/', methods=['POST'])
def result():
    # get number of users from form
    number_of_users = request.form['number_of_users']
    is_success = False
    # if number of users is not empty continue
    if number_of_users:
        user_list = h.GetUsers(number_of_users)
        if isinstance(user_list, str):
            status = user_list
        else:
            # create csv file and check if it is successful
            status = h.CreateCsv(user_list)
            if status == "finished creating user list csv":
                is_success = True
    else:
        status = "no input"
    # render webpage
    return render_template('test.html', number_of_users=number_of_users, status=status, success=is_success)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)