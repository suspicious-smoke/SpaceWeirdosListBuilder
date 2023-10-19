import sqlite3 as sqlite
from models import Warband
from models import Weirdo


class Database:
    def __init__(self, dbfile):
        self.dbfile = dbfile

    def add_warband(self, warband):
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "INSERT INTO WARBAND (name, warband_trait) VALUES (?, ?)"
            cursor.execute(query, (warband.name, warband.warband_trait_id))
            conn.commit()
            warband_id = cursor.lastrowid
        return warband_id

    def update_warband(self, warband_id, warband):
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "UPDATE WARBAND SET name = ?, warband_trait = ? WHERE (warband_id = ?)"
            cursor.execute(query, (warband.name, warband.warband_trait, warband_id))
            conn.commit()

    def delete_warband(self, warband_id):
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "DELETE FROM WARBAND WHERE (warband_id = ?)"
            cursor.execute(query, (warband_id))
            conn.commit()

    def get_warband(self, warband_id):
        warband_id = str(warband_id)
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = ' SELECT warband_id, name, warband_trait_id' \
                    ' FROM WARBAND as wb' \
                    ' WHERE (warband_id = ?)'
            cursor.execute(query, warband_id)
            warband_id, name, warband_trait_id = cursor.fetchone()
        _warband = Warband(name, warband_trait_id, warband_id=warband_id)
        # _warband.weirdos = Database.get_weirdos(warband_id)

        return _warband

    def get_weirdos(self, warband_id):
        weirdos = []
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = 'SELECT (weirdo_id, name, is_leader, leader_trait_id, total_points, ranged_weapon_id, ' \
                    'melee_weapon_id, speed_id, defense_id, firepower_id, prowess_id, willpower_id, warband_id)' \
                    'FROM WEIRDO' \
                    'WHERE warband_id = ?'
            cursor.execute(query, warband_id)
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
            query = '''SELECT wb.warband_id, wb.name as name, wt.name as trait
                        FROM WARBAND as wb
                        LEFT JOIN WARBAND_TRAIT as wt on wb.warband_trait_id = wt.warband_trait_id
                        '''
            cursor.execute(query)
            for warband_id, name, warband_trait_name in cursor:
                band_list.append(
                    (warband_id, name, warband_trait_name))
        return band_list

    # loads up all the weapons, attributes, leader trait, warband trait, psychic powers, equipment
    def get_traits(self):
        trait_list = []
        with sqlite.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = '''SELECT warband_trait_id, name, power 
                        FROM WARBAND_TRAIT
                    '''
            cursor.execute(query)
            # load traits into a list
            for warband_trait_id, name, power in cursor:
                trait_list.append(
                    (warband_trait_id, name, power))
        return trait_list
