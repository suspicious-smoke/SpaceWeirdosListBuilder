import sqlite3 as dbapi2


# class Equipment:
#     def __init__(self, name, e_type, notes, points):
#         self.name = name
#         self.e_type = e_type  # P=passive stat increase or A=item action
#         self.notes = notes
#         self.points = points
#
#
# class PsychicPower:
#     def __init__(self, name, p_type, notes, points):
#         self.name = name
#         self.p_type = p_type  # P=passive stat increase or A=item action
#         self.notes = notes
#         self.points = points
#
#
# class Weapon:
#     def __init__(self, name, w_range, actions, notes, points):
#         self.name = name
#         self.w_range = w_range
#         self.actions = actions
#         self.notes = notes
#         self.points = points
#
#
# class Attribute:
#     def __init__(self, name, level, points):
#         self.name = name
#         self.level = level
#         self.points = points


# class Weirdo:
#     def __init__(self, name):
#         self.name = name
#         self.leader = False # true/false
#         self.attributes = []
#         self.weapons = []
#         self.equipment = []
#         self.psychic_power = []
#
#         self.total_points = 0

# class WarbandTrait:
#     def __init__(self, name, power):
#         self.name = name
#         self.power = power


class Warband:
    def __init__(self, name, warband_trait=None, leader_trait=None):
        self.name = name
        self.warband_trait = warband_trait
        self.leader_trait = leader_trait
        # self.weirdos = []  # list.append(geeks(22, 33))
        # self._last_weirdo_key = 0

    # def add_weirdo(self, weirdo):
    #     self._last_weirdo_key += 1
    #     self.weirdos[self._last_weirdo_key] = weirdo
    #
    # def delete_weirdo(self, weirdo_key):
    #     if weirdo_key in self.weirdos:
    #         del self.weirdos[weirdo_key]
    #
    # def get_weirdo(self, weirdo_key):
    #     weirdo = self.weirdos.get(weirdo_key)
    #     if weirdo is None:
    #         return None
    #     return weirdo
    #
    # def get_weirdos(self):
    #     weirdos = []
    #     for weirdo_key, weirdo in self.weirdos.items():
    #         weirdos.append(weirdo)
    #     return weirdos


class Database:
    def __init__(self, dbfile):
        self.dbfile = dbfile

    def add_warband(self, warband):
        with dbapi2.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "INSERT INTO WARBAND (NAME, WARBAND_TRAIT) VALUES (?, ?)"
            cursor.execute(query, (warband.name, warband.warband_trait))
            conn.commit()
            warband_key = cursor.lastrowid
        return warband_key

    def update_warband(self, warband_key, warband):
        with dbapi2.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "UPDATE WARBAND SET NAME = ?, WARBAND_TRAIT = ? WHERE (ID = ?)"
            cursor.execute(query, (warband.name, warband.warband_trait, warband_key))
            conn.commit()

    def delete_warband(self, warband_key):
        with dbapi2.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "DELETE FROM WARBAND WHERE (ID = ?)"
            cursor.execute(query, (warband_key,))
            conn.commit()

    def get_warband(self, warband_key):
        with dbapi2.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "SELECT NAME, WARBAND_TRAIT FROM WARBAND WHERE (ID = ?)"
            cursor.execute(query, (warband_key,))
            name, warband_trait = cursor.fetchone()
        _warband = Warband(name, warband_trait=warband_trait)
        return _warband

    def get_warbands(self):
        warbands = []
        with dbapi2.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "SELECT ID, NAME, WARBAND_TRAIT FROM WARBAND ORDER BY ID"
            cursor.execute(query)
            for warband_key, name, warband_trait in cursor:
                warbands.append((warband_key, Warband(name, warband_trait)))
        return warbands


