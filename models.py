
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
    def __init__(self, name, warband_trait_id=None):
        self.name = name
        self.warband_trait_id = warband_trait_id
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
