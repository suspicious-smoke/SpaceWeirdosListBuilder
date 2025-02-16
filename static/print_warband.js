import { warband_traits, leader_traits, speed, defense, firepower, prowess, willpower, melee_weapons, ranged_weapons, equipment, powers} from './formdata.js';
import { getWarband, getWarbandPoints } from './local_storage.js';
window.onload = function() {
    
    const warband_id = document.getElementById('warband_id').value;
    let warband = getWarband(warband_id);
    document.title = `${warband.name}`;
    document.getElementById('warband_name').innerHTML =  warband.name;
    document.getElementById('warband_trait').innerHTML =  '['+warband.warband_trait+']';
    document.getElementById('leader_trait').innerHTML =  '['+warband.leader_trait+']';

    document.getElementById('warband_trait_text').innerHTML = warband_traits[warband.warband_trait];
    document.getElementById('leader_trait_text').innerHTML = leader_traits[warband.leader_trait];


    loadWeirdoPrintCards(warband); 
    document.getElementById('one_col_print').checked = false;
    document.getElementById('one_col_print').addEventListener('click', (checkbox) => {
        const template_card = document.getElementById('card_template');
        if (document.getElementById('one_col_print').checked) {
            template_card.classList.remove('col-6');
            template_card.classList.add('col-12');
        } else {
            template_card.classList.add('col-6');
            template_card.classList.remove('col-12');
        }
        loadWeirdoPrintCards(warband); 
    });
    document.getElementById('eq_desc').addEventListener('click', (checkbox) => {
        loadWeirdoPrintCards(warband); 
    });

    document.getElementById('hide_validation_summary').addEventListener('click', (checkbox) => {
        if (document.getElementById('hide_validation_summary').checked) {
            document.getElementById('validation_row').classList.add('hide_validation');
        } else {
            document.getElementById('validation_row').classList.remove('hide_validation');
        }
        loadWeirdoPrintCards(warband)

    });
} 

function loadWeirdoPrintCards(warband) {
    let weirdos = warband['weirdos'];
    let card_container = document.getElementById('weirdo_cards');
    card_container.innerHTML = '';
    getWarbandPoints(warband['warband_id']).then((data) => {
        document.getElementById('total_cost').innerHTML = data.points;
        if (data.validation != '' && !document.getElementById('validation_row').classList.contains('hide_validation')) {
            document.getElementById('validation_row').removeAttribute('hidden');
            document.getElementById('validation_text').innerHTML = data.validation;
        } else {
            document.getElementById('validation_row').setAttribute('hidden',true);
        }
        // create new card for each weirdo
        let first = true;
        for (const weirdo of weirdos) {
            let weirdo_cost = 0
            // get weirdo points
            for (const w_pts of data.weirdos) {
                if (weirdo['weirdo_id'] == w_pts.id) {
                    weirdo_cost = w_pts.points
                }
            }
            let template_card = document.getElementById('card_template');
            let new_card = template_card.cloneNode(true); // clear out events
            
            new_card.removeAttribute("hidden");
            new_card.removeAttribute("id");
            new_card.querySelector('.card-title').innerHTML = weirdo['name'];
            if (first) {
                new_card.querySelector('.card-title').innerHTML += '&emsp;[leader]';
                first = false;
            }
            
            new_card.querySelector('.card-cost').innerHTML = `Cost: ${weirdo_cost} (x${weirdo['copies']})`;
            if (weirdo['copies']==1) {
                new_card.querySelector('.card-cost').innerHTML = `Cost: ${weirdo_cost}`;
            }
            // card attributes
            for (const att of weirdo_attribute) {
                new_card.querySelector(`.card-${att}`).innerHTML = weirdo[att];
            } 
            // card weapons
            
            let melee = melee_weapons.find(weapon => weapon.name === weirdo['melee_weapon']);
            new_card.querySelector('.m_name').innerHTML = melee.name;
            new_card.querySelector('.m_action').innerHTML = 'act: '+ melee.actions;
            new_card.querySelector('.m_notes').innerHTML = melee.notes;

            
            if (weirdo['firepower'] != 0) {
                let ranged = ranged_weapons.find(weapon => weapon.name === weirdo['ranged_weapon']);
                new_card.querySelector('.r_name').innerHTML = ranged.name;
                new_card.querySelector('.r_action').innerHTML = 'act: '+ ranged.actions;
                new_card.querySelector('.r_notes').innerHTML = ranged.notes;
            } else {
                new_card.querySelector('.ranged_weapon').setAttribute("hidden", true);
            }
            // items
            let equipment_area = new_card.querySelector('.equipment_area');
            
            // Get list of equipment
            let equipment_list =  [];
            weirdo.equipment.forEach(eq => {
                const matchingEquipment = equipment.find(list_eq => list_eq.name === eq);
                if (matchingEquipment) {
                    equipment_list.push(matchingEquipment);
                }
            });

            // get list of powers
            let powers_list = [];
            weirdo.powers.forEach(pwr => {
                const matchingPower = powers.find(list_pwr => list_pwr.name === pwr);
                if (matchingPower) {
                    powers_list.push(matchingPower);
                }
            });

            // combine powers and equipment to one list
            let items_list = equipment_list.concat(powers_list);

            if (items_list.length == 0) {
                equipment_area.innerHTML = '&ensp;-'
            } else {
                for (const item of items_list) {
                    let template_item = new_card.querySelector('#item_template');
                    let item_card = template_item.cloneNode(true); // clear out events
                    let hide_long = ['Effect', 'Attack', 'Action']
                    item_card.removeAttribute("hidden");
                    item_card.removeAttribute("id");
                    item_card.querySelector('.name').innerHTML = `${item.name}`;
                    if (document.getElementById('eq_desc').checked && hide_long.includes(item.type) && item.notes.length > 70) {
                        item_card.querySelector('.notes').innerHTML = `(${item.type}) Information on how to use in book.` //item.notes.slice(0, 70) + "...";
                    } else {
                        item_card.querySelector('.notes').innerHTML = `(${item.type})  ${item.notes}`;
                    }
                    equipment_area.appendChild(item_card)
                }
            }

            card_container.appendChild(new_card);
        }
    });
}



