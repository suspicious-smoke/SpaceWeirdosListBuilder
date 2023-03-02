import sqlite3 as sqlite
from models import Warband


class Database:
    def __init__(self, dbfile):
        self.dbfile = dbfile

    def add_warband(self, warband):
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "INSERT INTO WARBAND (name, warband_trait, warband_power) VALUES (?, ?, ?)"
            cursor.execute(query, (warband.name, warband.warband_trait, warband.warband_power))
            conn.commit()
            warband_key = cursor.lastrowid
        return warband_key

    def update_warband(self, warband_key, warband):
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "UPDATE WARBAND SET name = ?, warband_trait = ? WHERE (warband_id = ?)"
            cursor.execute(query, (warband.name, warband.warband_trait, warband_key))
            conn.commit()

    def delete_warband(self, warband_key):
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "DELETE FROM WARBAND WHERE (warband_id = ?)"
            cursor.execute(query, (warband_key,))
            conn.commit()

    def get_warband(self, warband_key):
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "SELECT name, warband_trait FROM WARBAND WHERE (warband_id = ?)"
            cursor.execute(query, (warband_key,))
            name, warband_trait = cursor.fetchone()
        _warband = Warband(name, warband_trait=warband_trait)
        return _warband

    def get_warbands(self):
        warbands = []
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "SELECT warband_id, name, warband_trait FROM WARBAND ORDER BY warband_id"
            cursor.execute(query)
            for warband_key, name, warband_trait in cursor:
                warbands.append((warband_key, Warband(name, warband_trait)))
        return warbands
