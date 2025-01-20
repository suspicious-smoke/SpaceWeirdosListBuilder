# uses python 3.11.2
warband_traits = {
'No Trait': '',
 'Cyborgs': 'All members of the Warband can purchase 1 additional piece of equipment.',
 'Fanatics': 'Roll Willpower with +1DT for all rolls except Psychic Powers.',
 'Living Weapons': 'Unarmed attacks do not have -1DT to Prowess rolls.',
 'Heavily Armed': 'All Ranged weapons cost 1 point less.',
 'Mutants': 'Speed, Claws & Teeth, Horrible Claws & Teeth, and Whip/Tail cost 1 less point.',
 'Soldiers': 'Grenades, Heavy Armor, and Medkits may be purchased for free. They still use a model’s equipment slots.',
 'Undead': 'A second staggered condition does not take models in thisWarband out of action.'
}

leader_traits = {
  'No Trait': '',
  'Bounty Hunter': 'Once per round, when a model from your warband is touching a down or staggered enemy, it can take a Use Item action to make the enemy model out of action.',
  'Healer': 'During the Initiative Phase, one of your models within one stick of your leader may make a free Stand or Recover action with +1DT.' ,
  'Majestic': 'Any time one of your warband has to make a Willpower roll, that model may use the Leader’s Willpower instead.',
  'Monstrous': 'Non-Leader models must win a Willpower roll vs. your leader to move into contact.',
  'Political Officer': 'During the Initiative Phase, before rolling, take one of your Warband within LOS of your leader out of action to make all other models in the Warband ready, remove the broken condition from your warband, and gain +1DT to this Initiative roll.',
  'Sorcerer': 'Psychic Powers actions cost 1 action instead of 2, but may still only use 1 per turn.',
  'Tactician': '+1DT to Initiative rolls.'
}

speed={"1": 0, "2": 1, "3": 3 }
defense={"2d6": 2, "2d8": 4, "2d10": 8}
firepower={"0": 0, "2d8": 2, "2d10": 4}
prowess={"2d6": 2, "2d8": 4, "2d10": 6}
willpower={"2d6": 2, "2d8": 4, "2d10": 6}

ranged_weapons = [
    {'name':'Auto Pistol', 'actions':'3', 'notes':'-1DT range > 1 stick', 'points':0},
    {'name':'Heavy Pistol', 'actions':'2', 'notes':'+1 to Under Fire rolls, -1DT past 1 stick', 'points':1},
    {'name':'Energy Pistol', 'actions':'3', 'notes':'Reroll FP rolls of 1, -1DT range > 1 stick', 'points':2},
    {'name':'Auto Rifle', 'actions':'3', 'notes':'Aim1', 'points':1},
    {'name':'Heavy Rifle', 'actions':'2', 'notes':'Aim1,+1 to Under Fire rolls', 'points':2},
    {'name':'Sniper Rifle', 'actions':'1', 'notes':'Aim2, cannot target enemies < 1 stick away, reroll FP rolls of 1, +1 to Under Fire rolls', 'points':3},
    {'name':'Shotgun', 'actions':'2', 'notes':'Range ≤ 1 stick: +1 to Under Fire rolls Range > 1 stick: -1DT, reroll FP rolls of 1', 'points':2},
    {'name':'Energy Rifle', 'actions':'2', 'notes':'Aim1, reroll FP rolls of 1', 'points':2},
    {'name':'Flamer', 'actions':'1', 'notes':'Cone AoE', 'points':2},
    {'name':'Rocket Launcher', 'actions':'1', 'notes':'Aim2, Cannot target enemies < 1 stick away, Blast AoE', 'points':3},
    {'name':'Auto-Cannon', 'actions':'3', 'notes':'Reroll FP rolls of 1 or 2', 'points':3},
]

melee_weapons = [
    {'name':'Unarmed', 'actions':'3', 'notes':'-1DT to Prw rolls', 'points':0},
    {'name':'Claws & Teeth', 'actions':'3', 'notes':'-', 'points':2},
    {'name':'Horrible Claws & Teeth', 'actions':'3', 'notes':'+1 to Under Attack rolls', 'points':3},
    {'name':'Melee Weapon', 'actions':'2', 'notes':'-', 'points':1},
    {'name':'Powered Weapon', 'actions':'2', 'notes':'Reroll Prw rolls of 1', 'points':2},
    {'name':'Large Melee Weapon', 'actions':'1', 'notes':'+1 to Under Attack rolls', 'points':1},
    {'name':'Large Powered Weapon', 'actions':'1', 'notes':'Reroll Prw rolls of 1, +1 to Under Attack rolls', 'points':3},
    {'name':'Whip/Tail', 'actions':'2', 'notes':'Can target enemies up to 1 stick away', 'points':2}
]

leader_traits = {
  'No Trait': '',
  'Bounty Hunter': 'Once per round, when a model from your warband is touching a down or staggered enemy, it can take a Use Item action to make the enemy model out of action.',
  'Healer': 'During the Initiative Phase, one of your models within one stick of your leader may make a free Stand or Recover action with +1DT.' ,
  'Majestic': 'Any time one of your warband has to make a Willpower roll, that model may use the Leader’s Willpower instead.',
  'Monstrous': 'Non-Leader models must win a Willpower roll vs. your leader to move into contact.',
  'Political Officer': 'During the Initiative Phase, before rolling, take one of your Warband within LOS of your leader out of action to make all other models in the Warband ready, remove the broken condition from your warband, and gain +1DT to this Initiative roll.',
  'Sorcerer': 'Psychic Powers actions cost 1 action instead of 2, but may still only use 1 per turn.',
  'Tactician': '+1DT to Initiative rolls.'
}

equipment = [
  {'name': 'Cybernetics', 'type': 'Passive', 'notes': '+1 to Prw rolls', 'points': 1},
  {'name': 'Psychic Focus', 'type': 'Passive', 'notes': '+1 to Will rolls', 'points': 1},
  {'name': 'Targeting Reticule', 'type': 'Passive', 'notes': '+1 to FP rolls', 'points': 1},
  {'name': 'Heavy Armor', 'type': 'Passive', 'notes': '+1 to Def rolls', 'points': 1},
  {'name': 'Grenade*', 'type': 'Action', 'notes': 'Targets point up to 1 stick from attacker, Blast AOE, 2d10 FP , +1 to Under Fire rolls', 'points': 1},
  {'name': 'Jump Pack', 'type': 'Passive', 'notes': 'The model can ignore terrain and other models when taking Move actions', 'points': 1},
  {'name': 'Medkit*', 'type': 'Action', 'notes': '1 model touching this model becomes ready', 'points': 1},
  {'name': 'Stealth Suit', 'type': 'Passive', 'notes': 'If this model’s base touches a piece of terrain, enemy models do not have LoS unless they are within 1 stick of the stealthy model', 'points': 1}
]

powers = [
  {"name": "Fear", "type": "Attack", "effect": "Each enemy model within 1 stick who loses its opposed Will roll must move 1 stick away from the psychic.", "points": 1},
  {"name": "Healing", "type": "Effect", "effect": "1 model within 1 stick of this model and in LoS becomes ready.", "points": 1},
  {"name": "Meat Puppet", "type": "Effect", "effect": "Return 1 OoA model to the table and place within 1 stick of the psychic. The returned model’s Spd is reduced by 1 (min 1), and rolls with -1DT for all rolls. A model can only be returned to the table once.", "points": 2},
  {"name": "Mind Control", "type": "Attack", "effect": "Targeted enemy takes one action of the psychic’s choice.", "points": 2},
  {"name": "Mind Stab", "type": "Attack", "effect": "Target 1 enemy model within 1 stick. Roll on Under Fire table +3.", "points": 3},
  {"name": "Prescience", "type": "Effect", "effect": "Choose any model on the table to either gain +1DT or -1DT for all their actions this round.", "points": 1},
  {"name": "Telekinesis", "type": "Either", "effect": "Effect: move 1 obstacle or ally up to 1 stick. Attack: move an enemy 1 stick.", "points": 1},
  {"name": "Teleport", "type": "Effect", "effect": "Place the psychic anywhere on the board.", "points": 1}
]


class Warband:
    def __init__(self, warband_id):
        self.warband_id = warband_id
        self.warband_traits=warband_traits # fill the warband traits
        self.leader_traits = leader_traits
        # lists for weirdo selections
        self.speed_list = speed
        self.defense_list = defense
        self.firepower_list = firepower
        self.prowess_list = prowess
        self.willpower_list = willpower
        
        # weapons
        self.ranged_weapons = ranged_weapons
        self.melee_weapons = melee_weapons
        self.equipment = equipment
        self.powers = powers

        self.warband_traits_html = '<br><br>'.join(f'<b>{key}</b>: {value}' for key, value in list(warband_traits.items())[1:])
        self.leader_traits_html = '<br><br>'.join(f'<b>{key}</b>: {value}' for key, value in list(leader_traits.items())[1:])
        