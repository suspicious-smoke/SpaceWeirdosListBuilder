import sqlite3 as sqlite
from models import Warband
from models import Weirdo


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
            cursor.execute(query)
            conn.commit()

    def get_warband(self, warband_key):
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = ' SELECT warband_id, name, warband_trait_id' \
                    ' FROM WARBAND as wb' \
                    ' WHERE (warband_id = ?)'
            cursor.execute(query, warband_key)
            warband_id, name, power = cursor.fetchone()
        _warband = Warband(warband_id, name, power)
        _warband.weirdos = Database.get_weirdos(warband_key)

        return _warband

    def get_weirdos(self, warband_key):
        weirdos = []
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = 'SELECT (weirdo_id, name, is_leader, leader_trait_id, total_points, ranged_weapon_id, ' \
                    'melee_weapon_id, speed_id, defense_id, firepower_id, prowess_id, willpower_id, warband_id)' \
                    'FROM WEIRDO' \
                    'WHERE warband_id = ?'
            cursor.execute(query, warband_key)
            for weirdo_id, name, is_leader, leader_trait_id, total_points, ranged_weapon_id, melee_weapon_id, speed_id \
                    , defense_id, firepower_id, prowess_id, willpower_id, warband_id in cursor:
                _weirdo = Weirdo(weirdo_id, name, is_leader, leader_trait_id, total_points,
                                 ranged_weapon_id, melee_weapon_id, speed_id, defense_id,
                                 firepower_id, prowess_id, willpower_id, warband_id)
                weirdos.append(_weirdo)
        return weirdos

    # Gives the list of warbands for the home page view
    def get_warbands(self):
        band_list = []
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = 'SELECT wb.warband_id, wb.name, wt.name' \
                    ' FROM WARBAND as wb' \
                    ' LEFT JOIN WARBAND_TRAIT as wt on wb.warband_trait_id = wt.warband_trait_id'
            cursor.execute(query)
            for warband_key, name, warband_trait_name in cursor:
                band_list.append(
                    (warband_key, name, warband_trait_name))
        return band_list

    # loads up all the weapons, attributes, leader trait, warband trait, psychic powers, equipment
    def load_options(self):
        view_bag = []
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = 'SELECT wb.warband_id, wb.name, wt.name' \
                    ' FROM WARBAND as wb' \
                    ' LEFT JOIN WARBAND_TRAIT as wt on wb.warband_trait_id = wt.warband_trait_id'
            cursor.execute(query)
            for warband_key, name, warband_trait_name in cursor:
                band_list.append(
                    (warband_key, name, warband_trait_name))

        return view_bag
