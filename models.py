WarbandTraits = {
'No Trait': '',
 'Cyborgs': 'All members of the Warband can purchase 1 additional piece of equipment.',
 'Fanatics': 'Roll Willpower with +1DT for all rolls except Psychic Powers.',
 'Living Weapons': 'Unarmed attacks do not have -1DT to Prowess rolls.',
 'Heavily Armed': 'All Ranged weapons cost 1 point less.',
 'Mutants': 'Speed, Claws & Teeth, Horrible Claws & Teeth, and Whip/Tail cost 1 less point.',
 'Soldiers': 'Grenades, Heavy Armor, and Medkits may be purchased for free. They still use a model’s equipment slots.',
 'Undead': 'A second staggered condition does not take models in thisWarband out of action.'
}

speed={"1": 0, "2": 1, "3": 3 }
defense={"2d6": 2, "2d8": 4, "2d10": 8}
firepower={"0": 0, "2d8": 2, "2d10": 4}
prowess={"2d6": 2, "2d8": 4, "2d10": 6}
willpower={"2d6": 2, "2d8": 4, "2d10": 6}

weapons = [
    {'type':'Ranged', 'name':'Auto Pistol', 'actions':'3', 'notes':'-1DT range > 1 stick', 'points':0},
    {'type':'Ranged', 'name':'Heavy Pistol', 'actions':'2', 'notes':'+1 to Under Fire rolls, -1DT past 1 stick', 'points':1},
    {'type':'Ranged', 'name':'Energy Pistol', 'actions':'3', 'notes':'Reroll FP rolls of 1, -1DT range > 1 stick', 'points':2},
    {'type':'Ranged', 'name':'Auto Rifle', 'actions':'3', 'notes':'Aim1', 'points':1},
    {'type':'Ranged', 'name':'Heavy Rifle', 'actions':'2', 'notes':'Aim1,+1 to Under Fire rolls', 'points':2},
    {'type':'Ranged', 'name':'Sniper Rifle', 'actions':'1', 'notes':'Aim2, cannot target enemies < 1 stick away, reroll FP rolls of 1, +1 to Under Fire rolls', 'points':3},
    {'type':'Ranged', 'name':'Shotgun', 'actions':'2', 'notes':'Range ≤ 1 stick: +1 to Under Fire rolls Range > 1 stick: -1DT, reroll FP rolls of 1', 'points':2},
    {'type':'Ranged', 'name':'Energy Rifle', 'actions':'2', 'notes':'Aim1, reroll FP rolls of 1', 'points':2},
    {'type':'Ranged', 'name':'Flamer', 'actions':'1', 'notes':'Cone AoE', 'points':2},
    {'type':'Ranged', 'name':'Rocket Launcher', 'actions':'1', 'notes':'Aim2, Cannot target enemies < 1 stick away, Blast AoE', 'points':3},
    {'type':'Ranged', 'name':'Auto-Cannon', 'actions':'3', 'notes':'Reroll FP rolls of 1 or 2', 'points':3},
    {'type':'Melee', 'name':'Unarmed', 'actions':'3', 'notes':'-1DT to Prw rolls', 'points':0},
    {'type':'Melee', 'name':'Claws & Teeth', 'actions':'3', 'notes':'-', 'points':2},
    {'type':'Melee', 'name':'Horrible Claws & Teeth', 'actions':'3', 'notes':'+1 to Under Attack rolls', 'points':3},
    {'type':'Melee', 'name':'Melee Weapon', 'actions':'2', 'notes':'-', 'points':1},
    {'type':'Melee', 'name':'Powered Weapon', 'actions':'2', 'notes':'Reroll Prw rolls of 1', 'points':2},
    {'type':'Melee', 'name':'Large Melee Weapon', 'actions':'1', 'notes':'+1 to Under Attack rolls', 'points':1},
    {'type':'Melee', 'name':'Large Powered Weapon', 'actions':'1', 'notes':'Reroll Prw rolls of 1, +1 to Under Attack rolls', 'points':3},
    {'type':'Melee', 'name':'Whip/Tail', 'actions':'2', 'notes':'Can target enemies up to 1 stick away', 'points':2}
]
class Warband:
    def __init__(self, warband_id):
        self.warband_id = warband_id
        self.trait_dropdown=WarbandTraits # fill the warband traits
        # lists for weirdo selections
        self.speed_list = speed
        self.defense_list = defense
        self.firepower_list = firepower
        self.prowess_list = prowess
        self.willpower_list = willpower


# class Equipment:
#     def __init__(self, name, e_type, notes, points):
#         self.name = name
#         self.e_type = e_type  # P=passive stat increase or A=item action
#         self.notes = notes
#         self.points = points


# class PsychicPower:
#     def __init__(self, name, p_type, effect, points):
#         self.name = name
#         self.p_type = p_type  # P=passive stat increase or A=item action
#         self.effect = effect
#         self.points = points


# class Weapon:
#     def __init__(self, name, weapon_type, actions, notes, points):
#         self.name = name
#         self.weapon_type = weapon_type
#         self.actions = actions
#         self.notes = notes
#         self.points = points


# class Attribute:
#     def __init__(self, name, level, points):
#         self.name = name
#         self.level = level  # either dice or number for speed
#         self.points = points

# class Weirdo:
#     # leader_trait_id, is_leader, ranged_weapon_id,melee_weapon_id,
#     def __init__(self, warband_id, weirdo_id=0, name='', total_points=0, speed_id=speed['1'], defense_id=defense['2d6'], 
#                  firepower_id=firepower['0'], prowess_id=prowess['2d6'], willpower_id=willpower['2d6']): 
#         self.warband_id = warband_id
#         self.weirdo_id = weirdo_id
#         self.name = name
#         self.total_points = total_points
    
#         self.willpower_id = willpower_id
#         self.prowess_id = prowess_id
#         self.firepower_id = firepower_id
#         self.defense_id = defense_id
#         self.speed_id = speed_id

#         # self.melee_weapon_id = melee_weapon_id
#         # self.ranged_weapon_id = ranged_weapon_id
        
#         # self.leader_trait_id = leader_trait_id
#         # self.is_leader = is_leader    
#     def serialize(self): # for turning dict to json
#         return {
#             'warband_id': self.warband_id,
#             'weirdo_id': self.weirdo_id,
#             'name': self.name,
#             'total_points': self.total_points,

#             'willpower_id': self.willpower_id,
#             'prowess_id': self.prowess_id,
#             'firepower_id': self.firepower_id,
#             'defense_id': self.defense_id,
#             'speed_id': self.speed_id
#         }