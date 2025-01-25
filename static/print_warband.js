import {getWarband, getWarbandPoints, getTraitsText, getWeirdoEquipmentInfo} from './local_storage.js';


window.onload = function() {
    const warband_id = document.getElementById('warband_id').value;
    let warband = getWarband(warband_id);
    document.getElementById('warband_name').innerHTML =  warband.name;
    document.getElementById('warband_trait').innerHTML =  '['+warband.warband_trait+']';
    document.getElementById('leader_trait').innerHTML =  '['+warband.leader_trait+']';

    getTraitsText(warband.warband_trait, warband.leader_trait).then(data => {
        document.getElementById('warband_trait_text').innerHTML = data.wt_text;
        document.getElementById('leader_trait_text').innerHTML = data.lt_text;
    });
  
    let weirdos = warband['weirdos'];
    let card_container = document.getElementById('weirdo_cards');
    card_container.innerHTML = '';
    getWarbandPoints(warband['warband_id']).then((data) => {
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
            
            new_card.querySelector('.card-cost').innerHTML = `cost: ${weirdo_cost}`;
            // card attributes
            for (const att of weirdo_attribute) {
                new_card.querySelector(`.card-${att}`).innerHTML = weirdo[att];
            } 
            // card weapons
            getWeirdoEquipmentInfo(weirdo).then((data) => {
                let melee = data.melee_weapon;
                new_card.querySelector('.m_name').innerHTML = melee.name;
                new_card.querySelector('.m_action').innerHTML = 'act: '+ melee.actions;
                new_card.querySelector('.m_notes').innerHTML = melee.notes;

                
                if (weirdo['firepower'] != 0) {
                    let ranged = data.ranged_weapon;
                    new_card.querySelector('.r_name').innerHTML = ranged.name;
                    new_card.querySelector('.r_action').innerHTML = 'act: '+ ranged.actions;
                    new_card.querySelector('.r_notes').innerHTML = ranged.notes;
                } else {
                    new_card.querySelector('.ranged_weapon').setAttribute("hidden", true);
                }
                // items
                let equipment_area = new_card.querySelector('.equipment_area');
                var items_list = data.equipment_list.concat(data.powers_list);


                if (items_list.length == 0) {
                    equipment_area.innerHTML = '&ensp;-'
                } else {
                    
                    for (const item of items_list) {
                        let template_item = new_card.querySelector('#item_template');
                        let item_card = template_item.cloneNode(true); // clear out events
                        item_card.removeAttribute("hidden");
                        item_card.removeAttribute("id");
                        item_card.querySelector('.name').innerHTML = `${item.name} (${item.type})`;
                        item_card.querySelector('.notes').innerHTML = item.notes;
                        equipment_area.appendChild(item_card)
                    }
                }

            });
            

        
            
            // equipment
            // if (weirdo['equipment'].length != 0) {
            //     for (const equip of weirdo['equipment']) {
            //         new_card.querySelector('.equipment').innerHTML += ` ${equip}<br>`;
            //     }
            // } else {
            //     new_card.querySelector('.equipment').innerHTML = '&ensp;-'
            // }
            // if (weirdo['powers'].length != 0) {
            //     for (const power of weirdo['powers']) {
            //         new_card.querySelector('.powers').innerHTML += ` ${power}<br>`;
            //     }
            // } else {
            //     new_card.querySelector('.powers').innerHTML = '&ensp;-'
            // }
            card_container.appendChild(new_card);
        }
    });
} 

