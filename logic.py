import csv
import requests


# pull users from randomuser.me/api
def GetUsers(val):
    try:
        val = int(val)
        user_list = []
        r = requests.get(f"https://randomuser.me/api/?results={val}")
        r_dict = r.json()['results']
        i = 0
        while i < val:
            r_row = r_dict[i]
            uuid = r_row['login'].get('uuid')
            name = f"{r_row['name'].get('first')}, {r_row['name'].get('last')}"
            username = r_row['login'].get('username')
            email = r_row['email']
            age = r_row['dob'].get('age')
            user_list.append([uuid, name, username, email, (age <= 65)])
            i += 1
        return user_list
    except ValueError:
        return "invalid input"


# create the csv file
def CreateCsv(_list):
    header = ['uuid', 'name', 'username', 'email', 'senior']
    try:

        # encoding='UTF8'
        with open('userdata.csv', 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(header)
            writer.writerows(_list)
            return "finished creating user list csv"
    except PermissionError:
        return "An error has occurred with opening the csv. Check that you do not have the file open and try again."
