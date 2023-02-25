#
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
    def __init__(self):
        self.warbands = {}
        self._last_warband_key = 0

    def add_warband(self, warband):
        self._last_warband_key += 1
        self.warbands[self._last_warband_key] = warband
        return self._last_warband_key

    def delete_warband(self, warband_key):
        if warband_key in self.warbands:
            del self.warbands[warband_key]

    def get_warband(self, warband_key):
        warband = self.warbands.get(warband_key)
        if warband is None:
            return None
        warband_ = Warband(warband.name, warband_trait=warband.warband_trait)
        return warband_

    def get_warbands(self):
        warbands = []
        for warband_key, warband in self.warbands.items():
            warband_ = Warband(warband.name, warband_trait=warband.warband_trait)
            warbands.append((warband_key, warband_))
        return warbands
