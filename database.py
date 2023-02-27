import sqlite3 as dbapi2


class Equipment:
    def __init__(self, name, e_type, notes, points):
        self.name = name
        self.e_type = e_type  # P=passive stat increase or A=item action
        self.notes = notes
        self.points = points


class PsychicPower:
    def __init__(self, name, p_type, effect, points):
        self.name = name
        self.p_type = p_type  # P=passive stat increase or A=item action
        self.effect = effect
        self.points = points


class Weapon:
    def __init__(self, name, weapon_type, actions, notes, points):
        self.name = name
        self.weapon_type = weapon_type
        self.actions = actions
        self.notes = notes
        self.points = points


class Attribute:
    def __init__(self, name, level, points):
        self.name = name
        self.level = level  # either dice or number for speed
        self.points = points


class WarbandTrait:
    def __init__(self, name, effect):
        self.name = name
        self.effect = effect


class Weirdo:
    def __init__(self, name):
        self.name = name
        self.is_leader = False  # true/false
        self.leader_trait = None
        self.leader_effect = None
        self.attributes = []
        self.weapons = []
        self.equipment = []
        self.psychic_power = []

        self.total_points = 0


class Warband:
    def __init__(self, name):
        self.name = name
        self.warband_trait = None
        self.warband_power = None
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
            query = "INSERT INTO WARBAND (name, warband_trait) VALUES (?, ?)"
            cursor.execute(query, (warband.name, warband.warband_trait))
            conn.commit()
            warband_key = cursor.lastrowid
        return warband_key

    def update_warband(self, warband_key, warband):
        with dbapi2.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "UPDATE WARBAND SET name = ?, warband_trait = ? WHERE (warband_id = ?)"
            cursor.execute(query, (warband.name, warband.warband_trait, warband_key))
            conn.commit()

    def delete_warband(self, warband_key):
        with dbapi2.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "DELETE FROM WARBAND WHERE (warband_id = ?)"
            cursor.execute(query, (warband_key,))
            conn.commit()

    def get_warband(self, warband_key):
        with dbapi2.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "SELECT name, warband_trait FROM WARBAND WHERE (warband_id = ?)"
            cursor.execute(query, (warband_key,))
            name, warband_trait = cursor.fetchone()
        _warband = Warband(name, warband_trait=warband_trait)
        return _warband

    def get_warbands(self):
        warbands = []
        with dbapi2.connect(self.dbfile) as conn:
            cursor = conn.cursor()
            query = "SELECT warband_id, name, warband_trait FROM WARBAND ORDER BY warband_id"
            cursor.execute(query)
            for warband_key, name, warband_trait in cursor:
                warbands.append((warband_key, Warband(name, warband_trait)))
        return warbands


