import { speed, defense, firepower, prowess, willpower, melee_weapons, ranged_weapons, equipment, powers } from './formdata.js';
function getLocalData() {
    const json_warband = localStorage.getItem('warbands');
    if (json_warband != null) {
        return JSON.parse(json_warband);
    }
    return {warbands:[]};
}


// return a list of favorite weirdos
function getLocalFavoriteData() {
    const json_favorites = localStorage.getItem('favorites');
    if (json_favorites != null) {
        return JSON.parse(json_favorites);
    }
    return [];
}


function getWarband(warband_id) {
    const warbands = getLocalData()['warbands'];
    return warbands.find(wbnd => wbnd.warband_id == warband_id);
}



function getWeirdo(warband_id, weirdo_id) {
    let warband = getWarband(warband_id);
    return warband['weirdos'].find(x => x.weirdo_id == weirdo_id);
}


async function getWarbandPoints(warband_id) {
    let warband = getWarband(warband_id);
    let pts = calculateWeirdoPoints(warband);
    return pts;
}


function calculateWeirdoPoints(warband) {
    const mutant_weapons = ['Claws & Teeth', 'Horrible Claws & Teeth', 'Whip/Tail'];
    const soldiers_equipment = ['Grenade*', 'Heavy Armor', 'Medkit*'];
    let points = 0;
    let weirdoPointsList = [];
    let validation = [];
    let firstOver20 = false;
    warband.weirdos.forEach((weirdo, index) => {
        let speedDiscount = warband.warband_trait === 'Mutants' ? 1 : 0;
        let weirdoPts = Math.max(0, speed[weirdo.speed] - speedDiscount) +
                        defense[weirdo.defense] +
                        firepower[weirdo.firepower] +
                        prowess[weirdo.prowess] +
                        willpower[weirdo.willpower];

        let rangedDiscount = 0;
        let meleeDiscount = 0;
        if (warband.warband_trait === 'Heavily Armed') {
            rangedDiscount = 1;
        } else if (warband.warband_trait === 'Mutants' && mutant_weapons.includes(weirdo.melee_weapon)) {
            meleeDiscount = 1;
        }

        if (weirdo.ranged_weapon) {
            weirdoPts += Math.max(0, item_points(ranged_weapons, weirdo.ranged_weapon) - rangedDiscount);
        }
        if (weirdo.melee_weapon) {
            weirdoPts += Math.max(0, item_points(melee_weapons, weirdo.melee_weapon) - meleeDiscount);
        }

        weirdo.equipment.forEach(equip => {
            if (!(warband.warband_trait === 'Soldiers' && soldiers_equipment.includes(equip))) {
                weirdoPts += item_points(equipment, equip);
            }
        });

        weirdo.powers.forEach(power => {
            weirdoPts += item_points(powers, power);
        });

        points += weirdoPts * parseInt(weirdo.copies, 10);
        weirdoPointsList.push({ id: weirdo.weirdo_id, points: weirdoPts });

        // Points validation
        let wName = weirdo.name;
        if (weirdoPts > 25) {
            validation.push(`${wName} is over 25 points.`);
        } else if (weirdoPts > 20) {
            if (firstOver20) {
                validation.push(`${wName} is over 20 points (only one is allowed to be over 20).`);
            } else {
                firstOver20 = true;
            }
        }

        // Equipment validation
        let eqAmnt = warband.warband_trait === 'Cyborg' ? 2 : 1;
        if (index === 0) {
            eqAmnt += 1;
        }
        if (weirdo.equipment.length > eqAmnt) {
            validation.push(`${wName} is over equipment limit of ${eqAmnt}`);
        }
    });

    let valText = validation.length > 0 ? `<ul><li>${validation.join('</li><li>')}</li></ul>` : '';

    return { points, weirdos: weirdoPointsList, validation: valText };
}

function item_points(itemList, weirdoItem) {
    for (let item of itemList) {
        if (item.name === weirdoItem) {
            return item.points;
        }
    }
    return 0;
}


export {getLocalData, getLocalFavoriteData, getWarband, getWarbandPoints, getWeirdo };

