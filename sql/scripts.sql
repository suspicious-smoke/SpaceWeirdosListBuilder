'This lists all the creation scripts for the sqlite database. It is not referenced in the code.

DROP TABLE IF EXISTS EQUIPMENT;
CREATE TABLE EQUIPMENT (
  equipment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(80) NOT NULL,
  e_type VARCHAR(80),
  effect VARCHAR(200),
  points INTEGER
);

DROP TABLE IF EXISTS PSYCHIC_POWER;
CREATE TABLE PSYCHIC_POWER (
  psychic_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(80) NOT NULL,
  p_type VARCHAR(80),
  effect VARCHAR(200),
  points INTEGER
);


DROP TABLE IF EXISTS ATTRIBUTE;
CREATE TABLE ATTRIBUTE (
  attribute_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(80) NOT NULL,
  lvl VARCHAR(80),
  points INTEGER
);

DROP TABLE IF EXISTS WEAPON;
CREATE TABLE WEAPON (
  weapon_id INTEGER PRIMARY KEY AUTOINCREMENT,
  w_type VARCHAR(80),
  name VARCHAR(80) NOT NULL,
  actions VARCHAR(80),
  notes VARCHAR(200),
  points INTEGER
);


DROP TABLE IF EXISTS WEIRDO;
CREATE TABLE WEIRDO (
  weirdo_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(80) NOT NULL,
  is_leader BOOLEAN,
  leader_trait VARCHAR(80),
  leader_effect  VARCHAR(80),
  total_points INTEGER NOT NULL,
  ranged_weapon_id INTEGER,
  melee_weapon_id INTEGER,

  speed_id INTEGER,
  defense_id INTEGER,
  firepower_id INTEGER,
  prowess_id INTEGER,
  willpower_id INTEGER,

  warband_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS WARBAND;
CREATE TABLE WARBAND (
  warband_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(80) NOT NULL,
  warband_trait_id INTEGER
);

DROP TABLE IF EXISTS WARBAND_TRAIT;
CREATE TABLE WARBAND_TRAIT (
  warband_trait_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(80),
  power VARCHAR(300)
);

INSERT INTO WARBAND (name, warband_trait_id)
VALUES
("Dark Oaths", 1),
("Alien Hive", 1);

INSERT INTO WARBAND_TRAIT (name, power)
VALUES
("Cyborgs", "All members of the Warband can purchase 1 additional piece of equipment."),
("Fanatics", "Roll Willpower with +1DT for all rolls except Psychic Powers."),
("Living Weapons", "Unarmed attacks do not have -1DT to Prowess rolls."),
("Heavily Armed", "All Ranged weapons cost 1 point less."),
("Mutants", "Speed, Claws & Teeth, Horrible Claws & Teeth, and Whip/Tail cost 1 less point."),
("Soldiers", "Grenades, Heavy Armor, and Medkits may be purchased for free. They still use a model’s equipment slots."),
("Undead", "A second staggered condition does not take models in thisWarband out of action.");


INSERT INTO ATTRIBUTE (name, lvl, points)
VALUES
("speed", "1", 0), ("speed", "2", 1), ("speed", "3", 3),
("defense", "2d6", 2), ("defense", "2d8", 4), ("defense", "2d10", 8),
("firepower", "0", 0), ("firepower", "2d8", 2), ("firepower", "2d10", 4),
("prowess", "2d6", 2), ("prowess", "2d8", 4), ("prowess", "2d10", 6),
("willpower", "2d6", 2), ("willpower", "2d8", 4), ("willpower", "2d10", 6);


INSERT INTO EQUIPMENT (name, e_type, effect, points)
VALUES
("Cybernetics", "P","+1 to Prw rolls", 1),
("Psychic Focus", "P","+1 to Will rolls", 1),
("Targeting Reticule", "P","+1 to FP rolls", 1),
("Heavy Armor", "P","+1 to Def rolls", 1),
("Grenade*", "A","Targets point up to 1 stick from attacker, Blast AOE, 2d10 FP , +1 to Under Fire rolls", 1),
("Jump Pack", "P","The model can ignore terrain and other models when taking Move actions", 1),
("Medkit*", "A","1 model touching this model becomes ready", 1),
("Stealth Suit", "P","If this model’s base touches a piece of terrain, enemy models do not have LoS unless they are within 1 stick of the stealthy model", 1);


INSERT INTO PSYCHIC_POWER (name, p_type, effect, points)
VALUES
("Fear", "Attack", "Each enemy model within 1 stick who loses its opposed Will roll must move 1 stick away from the psychic.", 1),
("Healing", "Effect", "1 model within 1 stick of this model and in LoS becomes ready.", 1),
("Meat Puppet", "Effect", "Return 1 OoA model to the table and place within 1 stick of the psychic. The returned model’s Spd is reduced by 1 (min 1), and rolls with -1DT for all rolls. A model can only be returned to the table once.", 2),
("Mind Control", "Attack", "Targeted enemy takes one action of the psychic’s choice.", 2),
("Mind Stab", "Attack", "Target 1 enemy model within 1 stick. Roll on Under Fire table +3.", 3),
("Prescience", "Effect", "Choose any model on the table to either gain +1DT or -1DT for all their actions this round.", 1),
("Telekinesis", "Either", "Effect: move 1 obstacle or ally up to 1 stick. Attack: move an enemy 1 stick.", 1),
("Teleport", "Effect", "Place the psychic anywhere on the board.", 1);


INSERT INTO WEAPON (w_type, name, actions, notes, points)
VALUES
("Ranged", "Auto Pistol", "3", "-1DT range > 1 stick", 0),
("Ranged", "Heavy Pistol", "2", "+1 to Under Fire rolls, -1DT past 1 stick", 1),
("Ranged", "Energy Pistol", "3", "Reroll FP rolls of 1, -1DT range > 1 stick", 2),
("Ranged", "Auto Rifle", "3", "Aim1", 1),
("Ranged", "Heavy Rifle", "2", "Aim1,+1 to Under Fire rolls", 2),
("Ranged", "Sniper Rifle", "1", "Aim2, cannot target enemies < 1 stick away, reroll FP rolls of 1, +1 to Under Fire rolls", 3),
("Ranged", "Shotgun", "2", "Range ≤ 1 stick: +1 to Under Fire rolls Range > 1 stick: -1DT, reroll FP rolls of 1", 2),
("Ranged", "Energy Rifle", "2", "Aim1, reroll FP rolls of 1", 2),
("Ranged", "Flamer", "1", "Cone AoE", 2),
("Ranged", "Rocket Launcher", "1", "Aim2, Cannot target enemies < 1 stick away, Blast AoE", 3),
("Ranged", "Auto-Cannon", "3", "Reroll FP rolls of 1 or 2", 3),
("Melee", "Unarmed", "3", "-1DT to Prw rolls", 0),
("Melee", "Claws & Teeth", "3", "-", 2),
("Melee", "Horrible Claws & Teeth", "3", "+1 to Under Attack rolls", 3),
("Melee", "Melee Weapon", "2", "-", 1),
("Melee", "Powered Weapon", "2", "Reroll Prw rolls of 1", 2),
("Melee", "Large Melee Weapon", "1", "+1 to Under Attack rolls", 1),
("Melee", "Large Powered Weapon", "1", "Reroll Prw rolls of 1, +1 to Under Attack rolls", 3),
("Melee", "Whip/Tail", "2", "Can target enemies up to 1 stick away", 2);