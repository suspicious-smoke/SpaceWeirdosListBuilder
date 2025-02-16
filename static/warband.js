import {warband_traits_html, leader_traits_html, warband_traits, leader_traits, speed, defense, firepower, prowess, willpower, melee_weapons, ranged_weapons, equipment, powers} from './formdata.js';
import {getLocalData, getLocalFavoriteData, getWarband, getWarbandPoints, getWeirdo} from './local_storage.js';
import {selectedSelect, resetSelect, fadeInOut, fUpper, deleteEventListeners, close_accordions} from './helpers.js';

// on warband page load
window.onload = function() {
    // setup popovers
    document.getElementById('html_warband_traits').setAttribute('data-bs-content', warband_traits_html);
    document.getElementById('html_leader_traits').setAttribute('data-bs-content',leader_traits_html);
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    
    // populate dropdowns
    dropdownSetup();

    loadWarband();
    setTraitText(); 
    // create new weirdo button
    document.getElementById('create_weirdo').addEventListener('click', function() {
        const warband_id = this.dataset.warband_id;
        // clear form for new weirdo
        close_accordions();
        document.getElementById('warband_id').value = warband_id;
        document.getElementById('weirdo_id').value = 0;
        document.getElementById('weirdo_name').value = '';
        for (const att of weirdo_attribute) {
            resetSelect(`${att}_select`);
        } 
        // default weapons
        document.querySelector('input[value="Unarmed"][name="melee_radios"]').checked = true;
        document.querySelector('input[value="Auto Pistol"][name="ranged_radios"]').checked = true;
        // clear all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.getElementById('weirdo_copies').value = 1;
        let warband = getWarband(warband_id);
        if (warband != null && warband['weirdos'].length > 0) {
            document.getElementById('copies_area').removeAttribute('hidden');
        } else {
            document.getElementById('copies_area').setAttribute('hidden', true);
        }
        
        wireSaveWeirdo();
        updateWeirdoPoints();
    });

    document.getElementById('fav_weirdo_list_btn').addEventListener('click', function() {
        loadFavoritesTable();
    });


    // wire save warband button
    document.getElementById('warband_info').addEventListener('change', saveWarband);
    document.getElementById('weirdo_modal').addEventListener('change', updateWeirdoPoints);
}

function dropdownSetup() {
    populateDropdown(document.getElementById('warband_trait'), warband_traits);
    populateDropdown(document.getElementById('leader_trait'), leader_traits);

    populateAttribute(document.getElementById('speed_select'), speed);
    populateAttribute(document.getElementById('defense_select'), defense);
    populateAttribute(document.getElementById('firepower_select'), firepower);
    populateAttribute(document.getElementById('prowess_select'), prowess);
    populateAttribute(document.getElementById('willpower_select'), willpower);
    loadSpecificDropDowns();
}


function loadSpecificDropDowns() {
    let melee_container = document.getElementById('melee-list');
    melee_container.innerHTML = '';
    for (const item of melee_weapons) {
        let new_row = cloneWeaponRow("template_melee_row", item);
        melee_container.appendChild(new_row);
    }

    let ranged_container = document.getElementById('ranged-list');
    ranged_container.innerHTML = '';
    for (const item of ranged_weapons) {
        let new_row = cloneWeaponRow("template_ranged_row", item);
        ranged_container.appendChild(new_row);
    }

    let powers_container = document.getElementById('powers-list');
    powers_container.innerHTML = '';
    for (const item of powers) {
        let new_row = cloneEquipmentRow("template_powers_row", item);
        powers_container.appendChild(new_row);
    }

    let equipment_container = document.getElementById('equipment-list');
    equipment_container.innerHTML = '';
    for (const item of equipment) {
        let new_row = cloneEquipmentRow("template_equipment_row", item);
        equipment_container.appendChild(new_row);
    }
}

function cloneWeaponRow(template_row_id, item) {
    let template_row = document.getElementById(template_row_id);
        let new_row = template_row.cloneNode(true); // clear out events
        new_row.removeAttribute("hidden");
        new_row.removeAttribute("id");
        new_row.querySelector('.form-check-input').setAttribute('value', item['name']);
        new_row.querySelector('.form-check-input').id = `item_${item['name']}`;
        new_row.querySelector('.form-check-label').innerHTML = item['name'];
        new_row.querySelector('.form-check-label').setAttribute('for', `item_${item['name']}`);
        new_row.querySelector('.pts').innerHTML = `Cost: ${item['points']}`;
        new_row.querySelector('.pts').setAttribute('value', item['points']);
        new_row.querySelector('.pts').setAttribute('data-discount', item['points']);
        new_row.querySelector('.act').innerHTML = `Actions: ${item['actions']}`;
        new_row.querySelector('.notes').innerHTML = item['notes'];
        return new_row;
}

function cloneEquipmentRow(template_row_id, item) {
    let template_row = document.getElementById(template_row_id);
    let new_row = template_row.cloneNode(true); // clear out events
    new_row.removeAttribute("hidden");
    new_row.removeAttribute("id");
    new_row.querySelector('.form-check-input').setAttribute('value', item['name']);
    new_row.querySelector('.form-check-input').id = `item_${item['name']}`;
    new_row.querySelector('.form-check-label').innerHTML = item['name'];
    new_row.querySelector('.form-check-label').setAttribute('for', `item_${item['name']}`);
    new_row.querySelector('.pts').innerHTML = `Cost: ${item['points']}`;
    new_row.querySelector('.pts').setAttribute('value', item['points']);
    new_row.querySelector('.pts').setAttribute('data-discount', item['points']);
    new_row.querySelector('.type').innerHTML = item['type'];
    new_row.querySelector('.notes').innerHTML = item['notes'];
    return new_row;
}

function populateDropdown(selectElement, data) {
    for (const [name, value] of Object.entries(data)) {
      const option = document.createElement('option');
      option.value = name;
      option.dataset.text = value;
      option.textContent = name;
      selectElement.appendChild(option);
    }
  }

  function populateAttribute(selectElement, data) {
    for (const [die, cost] of Object.entries(data)) {
      const option = document.createElement('option');
      option.value = cost;
      option.dataset.discount = cost;
      option.textContent = die;
      selectElement.appendChild(option);
    }
  }


function saveWarband() {
    let warband_id = document.getElementById('warband_id').value;
    // try to get warband
    let warband = getWarband(warband_id);
    if (warband == null) {
        saveNewWarband();
    } else {
        // just update name and trait and save
        warband['name'] = document.getElementById('warband_name').value;
        let t = document.getElementById('warband_trait');
        warband['warband_trait'] = t.options[t.selectedIndex].text;
        let lt = document.getElementById('leader_trait');
        warband['leader_trait'] = lt.options[lt.selectedIndex].text;
        setTraitText();
        // add warband back into warband list.
        let local_data = getLocalData();
        const i = local_data['warbands'].findIndex(x => x['warband_id'] == warband_id); // get warband
        if (i>-1) {
            local_data['warbands'][i] = warband; // save warband
        }
        localStorage.setItem('warbands', JSON.stringify(local_data));
        loadWeirdoCards(warband); // reload weirdos
    }
}


function setTraitText() {
    let t = document.getElementById('warband_trait');
    document.getElementById('warband_trait_text').innerHTML = t.options[t.selectedIndex].dataset.text;
    let lt = document.getElementById('leader_trait');
    document.getElementById('leader_trait_text').innerHTML = lt.options[lt.selectedIndex].dataset.text;
}

function loadWarband() {
    // check warband id
    const warband_id = document.getElementById('warband_id').value;
    let warband = getWarband(warband_id);
    if (warband != null) {
        // load warband info
        document.getElementById('warband_text').innerHTML = "Edit Warband";
        // load warband name and trait
        document.getElementById('warband_name').value = warband['name'];
        selectedSelect('warband_trait', warband['warband_trait']);
        selectedSelect('leader_trait', warband['leader_trait']);
        loadWeirdoCards(warband, false); // load weirdos
    } else if (warband_id != 0) { //if id doesn't exist, reload to id 0
        window.location.href = new_warband_url;
    } else {
        document.getElementById('warband_text').innerHTML = "Create Warband";
    }
}


function loadWeirdoCards(warband, saved=true) {
    let weirdos = warband['weirdos'];
    let card_container = document.getElementById('weirdo_cards');
    // clear old events
    deleteEventListeners('.edit_weirdo');
    deleteEventListeners('.delete_weirdo');
    deleteEventListeners('.duplicate_weirdo');
    deleteEventListeners('.move_weirdo');
    card_container.innerHTML = '';
    getWarbandPoints(warband['warband_id']).then((data) => {
        // validation
        if (data.validation == '') {
            document.getElementById('valid_area').removeAttribute('hidden');
            document.getElementById('invalid_area').setAttribute('hidden', true);
        } else {
            let invalid = document.getElementById('invalid_area')
            invalid.removeAttribute('hidden');
            document.getElementById('valid_area').setAttribute('hidden', true);
        
            // Destroy existing popover
            let popoverInstance = bootstrap.Popover.getInstance(invalid);
            if (popoverInstance) {
                popoverInstance.dispose();
            }
            // Update the data-bs-content attribute
            invalid.setAttribute("data-bs-content", data.validation);
            // Reinitialize popover
            new bootstrap.Popover(invalid);
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
            new_card.querySelector('.edit_weirdo').setAttribute('data-weirdo_id',weirdo['weirdo_id']);
            new_card.querySelector('.delete_weirdo').setAttribute('data-weirdo_id',weirdo['weirdo_id']);
            new_card.querySelector('.duplicate_weirdo').setAttribute('data-weirdo_id',weirdo['weirdo_id']);
            new_card.querySelector('.move_right').setAttribute('data-weirdo_id',weirdo['weirdo_id']);
            new_card.querySelector('.move_left').setAttribute('data-weirdo_id',weirdo['weirdo_id']);

            let weirdo_index = weirdos.findIndex(x => x['weirdo_id'] == weirdo['weirdo_id']);
            if (weirdo_index == 0) {
                new_card.querySelector('.move_left').setAttribute('hidden', true);
            } else if (weirdo_index == weirdos.length-1) {
                new_card.querySelector('.move_right').setAttribute('hidden', true);
            }

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
            let weapon_card = new_card.querySelector('.card-weapons');
            weapon_card.querySelector('.ranged').innerHTML = weirdo['ranged_weapon']
            if (weirdo['firepower'] == 0) {
                weapon_card.querySelector('.ranged').innerHTML = '&ensp;-'
            }
            weapon_card.querySelector('.melee').innerHTML = weirdo['melee_weapon']

            // equipment
            let equip_card = new_card.querySelector('.card-equipment');
            if (weirdo['equipment'].length != 0) {
                for (const equip of weirdo['equipment']) {
                    equip_card.querySelector('.equipment').innerHTML += ` ${equip}&emsp;`;
                }
            } else {
                equip_card.querySelector('.equipment').innerHTML = '&ensp;-'
            }
            if (weirdo['powers'].length != 0) {
                for (const power of weirdo['powers']) {
                    equip_card.querySelector('.powers').innerHTML += ` ${power}&emsp;`;
                }
            } else {
                equip_card.querySelector('.powers').innerHTML = '&ensp;-'
            }
            card_container.appendChild(new_card);
        }
        document.getElementById('total_cost').innerHTML = data.points;
        // wire Edit buttons
        const edit_btns = document.querySelectorAll('.edit_weirdo');
        edit_btns
        edit_btns.forEach(weirdo => {
            weirdo.addEventListener('click', (wrdo) => {
                loadWeirdoModal(wrdo, warband);
            });
        });
        // wire delete buttons
        const delete_btns = document.querySelectorAll('.delete_weirdo');
        delete_btns.forEach(weirdo => {
            weirdo.addEventListener('click', (btn_elem) => {
                let weirdo_id = btn_elem.target.dataset.weirdo_id;
                let warband_id = document.getElementById('warband_id').value;
                let local_data = getLocalData();
                let {i,j} = get_ids(warband_id, weirdo_id, local_data);
                if (i > -1 && j > -1) {
                    local_data['warbands'][i]['weirdos'].splice(j,1);
                    localStorage.setItem('warbands', JSON.stringify(local_data));
                    loadWeirdoCards(local_data['warbands'][i]); // reload weirdos
                    return;
                }
            });
        });
        // move buttons wire
        const move_btns = document.querySelectorAll('.move_weirdo');
        move_btns.forEach(weirdo => {
            weirdo.addEventListener('click', (btn_elem) => {
                let weirdo_id = btn_elem.target.dataset.weirdo_id;
                //direction to move element in list
                let dir = (btn_elem.target.classList.contains('move_left') ? -1 : 1)
                let warband_id = document.getElementById('warband_id').value;
                let local_data = getLocalData();
                let {i,j} = get_ids(warband_id, weirdo_id, local_data);
                // execute swap entries
                if (j > -1 && i > -1) {
                    const temp_weirdo = {...local_data['warbands'][i]['weirdos'][j+dir]};
                    local_data['warbands'][i]['weirdos'][j+dir] = {...local_data['warbands'][i]['weirdos'][j]};
                    local_data['warbands'][i]['weirdos'][j] = temp_weirdo;
                    // save and reload
                    local_data['warbands'][i]['weirdos'][0]['copies'] = 1; // set copies to 1.
                    localStorage.setItem('warbands', JSON.stringify(local_data));
                    loadWeirdoCards(local_data['warbands'][i]); // reload weirdos
                    return;
                }

            });
        });
        const duplicate_btns = document.querySelectorAll('.duplicate_weirdo');
        duplicate_btns.forEach(weirdo => {
            weirdo.addEventListener('click', (btn_elem) => {
                let weirdo_id = btn_elem.target.dataset.weirdo_id;
                let warband_id = document.getElementById('warband_id').value;
                let local_data = getLocalData();
                let {i,j} = get_ids(warband_id, weirdo_id, local_data); // get weirdo and warband id
                // execute swap entries
                if (j > -1 && i > -1) {
                    let warband = local_data['warbands'][i];
                    let new_weirdo = structuredClone(warband['weirdos'][j]);
                    new_weirdo['weirdo_id'] = getNextWeirdoID(warband);
                    // new_weirdo['name'] += ' (c)' // add copy text
                    warband['weirdos'].push(new_weirdo);
                    localStorage.setItem('warbands', JSON.stringify(local_data));
                    loadWeirdoCards(warband); // reload weirdos
                    return;
                }
            });
        });
        if (saved) {
            fadeInOut('save_alert');  
        }
    });
}


function getNextWeirdoID(warband) {
    let next_weirdo_id = 1;
    for (let i = 0; i < warband['weirdos'].length; i++) {
        let _weirdo = warband['weirdos'][i]
        // increase weirdo id
        if (_weirdo['weirdo_id'] >= next_weirdo_id) {
            next_weirdo_id = parseInt(_weirdo['weirdo_id']) + 1;
        }
    }
    return next_weirdo_id;
}


function get_ids(warband_id, weirdo_id, local_data) {
    const i = local_data['warbands'].findIndex(x => x['warband_id'] == warband_id); // get warband
    const j = local_data['warbands'][i]['weirdos'].findIndex(x => x['weirdo_id'] == weirdo_id); // get weirdo
    return {i,j}
}


function loadWeirdoModal(wrdo, warband) {
    // load weirdo into modal
    close_accordions();
    let weirdo_id = wrdo.target.dataset.weirdo_id;
    let warband_id = warband['warband_id'];
    document.getElementById('warband_id').value = warband_id;
    document.getElementById('weirdo_id').value = weirdo_id;
    let weirdo = getWeirdo(warband_id, weirdo_id);

    document.getElementById('weirdo_name').value = weirdo['name'];
    // attributes
    for (const att of weirdo_attribute) {
        selectedSelect(`${att}_select`, weirdo[att]);
    };     
    // melee weapons
    if (weirdo['melee_weapon'] != null) {
        document.querySelector(`input[value="${weirdo['melee_weapon']}"][name="melee_radios"]`).checked = true;
    } else { // default value
        document.querySelector('input[value="Unarmed"][name="melee_radios"]').checked = true;
    }
    // ranged melee weapons
    if (weirdo['ranged_weapon'] != null) {
        document.querySelector(`input[value="${weirdo['ranged_weapon']}"][name="ranged_radios"]`).checked = true;
    } else { // default value
        document.querySelector('input[value="Auto Pistol"][name="ranged_radios"]').checked = true;
    }
    // clear all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });
    // equipment/powers
    if (weirdo['equipment'] != null) {
        for (const equip of weirdo['equipment']) {
            document.querySelector(`input[value="${equip}"][name="equipment_checkbox"]`).checked = true;
        }
    }
    if (weirdo['powers'] != null) {
        for (const power of weirdo['powers']) {
            document.querySelector(`input[value="${power}"][name="powers_checkbox"]`).checked = true;
        }
    }

    const weirdo_index = warband['weirdos'].findIndex(x => x.weirdo_id == weirdo_id);
    if (weirdo_index == 0) {
        document.getElementById('weirdo_copies').value = 1;
        document.getElementById('copies_area').setAttribute('hidden', true);
    } else {
        document.getElementById('copies_area').removeAttribute('hidden');
        document.getElementById('weirdo_copies').value = weirdo['copies'];
    }
    
    

    updateWeirdoPoints();         
    wireSaveWeirdo();
}


function wireSaveWeirdo() {
    document.getElementById('save_weirdo').removeEventListener('click', saveWeirdo);
    document.getElementById('save_weirdo').addEventListener('click', saveWeirdo);
    document.getElementById('favorite_weirdo').removeEventListener('click', favoriteWeirdo);
    document.getElementById('favorite_weirdo').addEventListener('click', favoriteWeirdo);
}


// gets the points for a given weirdo and sets the modal cost
function updateWeirdoPoints() {
    let total_points = 0;
    total_points += setModalWeirdoEquipArea();
    for (const att of weirdo_attribute) {
        total_points += updateAttributePoints(att);
    } 
    document.querySelector('.weirdo_cost').innerHTML = `Individual Cost: ${total_points}`; 
    document.querySelector('.weirdo_cost').setAttribute('data-points', total_points);  
}


function updateAttributePoints(attribute) {
    let text = fUpper(attribute);
    let selector = `${attribute}_select`;
    let s = document.getElementById(selector);
    let cost = s.options[s.selectedIndex].getAttribute('data-discount');
    document.querySelector(`label[for="${selector}"]`).innerHTML = `${text} [${cost}]`
    return parseInt(cost);
}


function setEquipDiscounts() {
    let mutant_weapons = ['Claws & Teeth','Horrible Claws & Teeth','Whip/Tail'];
    let soldiers_equipment = ['Grenade*','Heavy Armor','Medkit*'];
    // get warband trait
    let t = document.getElementById('warband_trait');
    let trait = t.options[t.selectedIndex].text;
    // reset all item points to default
    let reset_rows = document.querySelectorAll('.ranged-row, .equip-row, .melee-row')
    reset_rows.forEach((row) => {
        let pts = row.querySelector('.pts');
        pts.innerHTML = `Cost:  ${pts.getAttribute('value')}`
        pts.setAttribute('data-discount', pts.getAttribute('value'));
        pts.classList.remove('text-success');
    });
    
    const selectList = document.getElementById('speed_select').options;
    for (let i = 0; i < selectList.length; i++) {
        selectList[i].setAttribute('data-discount', selectList[i].getAttribute('value'));
      }
      document.querySelector('label[for="speed_select"]').classList.remove('text-success');

    if (trait == 'Mutants') {
        const selectList = document.getElementById('speed_select').options;
        for (let i = 0; i < selectList.length; i++) {
            selectList[i].setAttribute('data-discount', Math.max(0,selectList[i].getAttribute('value')-1));
        }
        document.querySelector('label[for="speed_select"]').classList.add('text-success');
        document.querySelectorAll('.melee-row').forEach((row) => {
            let melee_name = row.querySelector('.form-check-input').getAttribute('value');
            let pts = row.querySelector('.pts');
            let points = parseInt(pts.getAttribute('value'))-1;
            if (mutant_weapons.includes(melee_name.replace(/&amp;/g, "&"))) {
                pts.innerHTML = `Cost:  ${points}`;
                pts.setAttribute('data-discount', points);
                pts.classList.add('text-success');
            } else {
                pts.setAttribute('data-discount', pts.getAttribute('value'));
            }
        });
    }  else if (trait == 'Heavily Armed') {
        document.querySelectorAll('.ranged-row').forEach((row) => {
            let pts = row.querySelector('.pts');
            let points = Math.max(0,parseInt(pts.getAttribute('value'))-1);
            pts.innerHTML = `Cost:  ${points}`
            pts.setAttribute('data-discount', points);
            pts.classList.add('text-success');
        });
    } else if (trait == 'Soldiers') {
        document.querySelectorAll('.equip-row').forEach((row) => {
            let equip_name = row.querySelector('.form-check-input').getAttribute('value');
            let pts = row.querySelector('.pts');
            if (soldiers_equipment.includes(equip_name.replace(/&amp;/g, "&"))) {
                pts.setAttribute('data-discount', 0);
                pts.innerHTML = `Cost:  0`;
                pts.classList.add('text-success');
            } else {
                pts.setAttribute('data-discount', pts.getAttribute('value'));
            }
        });
    }
    
}

function setModalWeirdoEquipArea() {
    let equip_points = 0;
    setEquipDiscounts();
    // if firepower is 0, hide ranged weapons and set ranged weapon to auto pistol
    let ranged_list = document.getElementById('ranged-weapons-list');
    if (document.getElementById('firepower_select').selectedIndex == 0) {
        ranged_list.setAttribute("hidden", true);
        document.querySelector('input[value="Auto Pistol"][name="ranged_radios"]').checked = true;
    } else {
        ranged_list.removeAttribute("hidden");
    }

    // get weapon selected. Copy over points and other values
    let melee_selected = document.querySelector('input[name="melee_radios"]:checked').closest('.row');
    let melee_name = melee_selected.querySelector('.form-check-label').innerHTML;
    document.getElementById('e-melee-name').innerHTML = `Melee: ${melee_name}`;
    document.getElementById('e-melee-actions').innerHTML = melee_selected.querySelector('.act').innerHTML;
    let melee_pts_area = melee_selected.querySelector('.pts');
    equip_points += parseInt(melee_pts_area.getAttribute('data-discount'));
    document.getElementById('e-melee-points').innerHTML = melee_pts_area.innerHTML;
    document.getElementById('e-melee-notes').innerHTML = melee_selected.querySelector('.notes').innerHTML;

    let ranged_selected = document.querySelector('input[name="ranged_radios"]:checked').closest('.row');
    let ranged_name = ranged_selected.querySelector('.form-check-label').innerHTML;
    document.getElementById('e-ranged-name').innerHTML = `Ranged: ${ranged_name}`;
    document.getElementById('e-ranged-actions').innerHTML = ranged_selected.querySelector('.act').innerHTML;
    let ranged_pts_area = ranged_selected.querySelector('.pts');
    equip_points += parseInt(ranged_pts_area.getAttribute('data-discount'));
    document.getElementById('e-ranged-points').innerHTML = ranged_pts_area.innerHTML;
    document.getElementById('e-ranged-notes').innerHTML = ranged_selected.querySelector('.notes').innerHTML;

    // get selected equipment
    let eq_area = document.getElementById('equipments-area');
    eq_area.innerHTML = '';
    let equipment_boxes = document.querySelectorAll('input[name="equipment_checkbox"]:checked');
    equipment_boxes.forEach((checkbox) => {
        let row = checkbox.closest('.row');
        let points = row.querySelector('.pts').getAttribute('data-discount');
        equip_points += parseInt(points);
        eq_area.innerHTML += row.querySelector('.form-check-label').innerHTML + ` [${points}]&emsp;`;
    });

    // powers area
    let pwr_area = document.getElementById('powers-area');
    pwr_area.innerHTML = '';
    let pwr_boxes = document.querySelectorAll('input[name="powers_checkbox"]:checked');
    pwr_boxes.forEach((checkbox) => {
        let row = checkbox.closest('.row');
        let points = row.querySelector('.pts').getAttribute('value');
        equip_points += parseInt(points);
        pwr_area.innerHTML += row.querySelector('.form-check-label').innerHTML + ` [${points}]&emsp;`;
    });

    return equip_points
}

function getWeirdoFormInfo() {
    // load attributes into weirdo
    let weirdo = {
        name:document.getElementById('weirdo_name').value,
    }
    for (const att of weirdo_attribute) {
        let s = document.getElementById(`${att}_select`);
        let item = s.options[s.selectedIndex].text;
        weirdo[att] = item;
    } 
    // get selected radio
    weirdo['melee_weapon'] = document.querySelector('input[name="melee_radios"]:checked').value;
    weirdo['ranged_weapon'] = document.querySelector('input[name="ranged_radios"]:checked').value;
    //equipment
    let equipment = [];
    const equipment_boxes = document.querySelectorAll('input[name="equipment_checkbox"]');
    equipment_boxes.forEach((checkbox) => {
        if (checkbox.checked) {
            equipment.push(checkbox.value);
        }
    });
    weirdo['equipment'] = equipment;

    //equipment
    let powers = [];
    const powers_checkbox = document.querySelectorAll('input[name="powers_checkbox"]');
    powers_checkbox.forEach((checkbox) => {
        if (checkbox.checked) {
            powers.push(checkbox.value);
        }
    });
    weirdo['powers'] = powers;
    return weirdo;
}

function saveWeirdo() {
    let weirdo = getWeirdoFormInfo();
    weirdo['copies'] = document.getElementById('weirdo_copies').value;
    weirdo['weirdo_id'] = document.getElementById('weirdo_id').value;
    let weirdo_id = weirdo['weirdo_id'];
    let warband_id = document.getElementById('warband_id').value;

    // first load from local storage
    let warband = getWarband(warband_id);   
    // new warband
    if (warband == null) {
        weirdo['copies'] = 1;
        saveNewWarband(weirdo);
    } else {
        
        // warband exists:
        warband['name'] = document.getElementById('warband_name').value;
        let t = document.getElementById('warband_trait');
        warband['warband_trait'] = t.options[t.selectedIndex].text;
        let lt = document.getElementById('leader_trait');
        warband['leader_trait'] = lt.options[lt.selectedIndex].text;
        // check weirdo id's
        let weirdo_exists = false;
        let next_weirdo_id = 1;
        for (let i = 0; i < warband['weirdos'].length; i++) {
            let _weirdo = warband['weirdos'][i]
            if (_weirdo['weirdo_id'] == weirdo_id) {
                warband['weirdos'][i] = weirdo; // replace old weirdo
                weirdo_exists = true;
            }
            // increase weirdo id
            if (_weirdo['weirdo_id'] >= next_weirdo_id) {
                next_weirdo_id = parseInt(_weirdo['weirdo_id']) + 1;
            }
        }
        if (!weirdo_exists) {
            // add weirdo to warband
            weirdo['weirdo_id'] = next_weirdo_id;
            warband['weirdos'].push(weirdo);
        }
        // add warband back into warband list.
        let local_data = getLocalData();
        
        const i = local_data['warbands'].findIndex(x => x['warband_id'] == warband_id); // get warband
        if (i>-1) {
            local_data['warbands'][i] = warband; // swap warband
        }
        localStorage.setItem('warbands', JSON.stringify(local_data));
        loadWeirdoCards(warband); // reload weirdos   
    }
}

function saveNewWarband(weirdo=null) {
    // get new warband id
    let new_id = 1;
    let warband_data = getLocalData();
    for (let i=0; i < warband_data['warbands'].length; i++) {
        if (warband_data['warbands'][i]['warband_id'] >= new_id ) {
            new_id = warband_data['warbands'][i]['warband_id']+1;
        }
    }
    // add warband into local data
    let t = document.getElementById('warband_trait');
    let warband_trait = t.options[t.selectedIndex].text;
    let lt = document.getElementById('leader_trait');
    let leader_trait = lt.options[lt.selectedIndex].text;
    const new_warband = {
        warband_id: new_id,
        name: document.getElementById('warband_name').value,
        warband_trait: warband_trait,
        leader_trait: leader_trait,
        weirdos: []
    }
    if (weirdo != null) {
        weirdo['weirdo_id'] = 1;
        new_warband['weirdos'].push(weirdo);
    }
    warband_data['warbands'].push(new_warband);
    localStorage.setItem('warbands', JSON.stringify(warband_data));
    window.location.href = '/warband/'+new_id; //redirect to new page
}  

// saves a favorited weirdo to the favorites local storage and then saves the weirdo.
function favoriteWeirdo() {
    // add favorited weirdo to local storage
    let favorites_data = getLocalFavoriteData();
    let weirdo = getWeirdoFormInfo();
    weirdo['cost'] = document.querySelector('.weirdo_cost').getAttribute('data-points');
    let newWeirdoId = 1;
    if (favorites_data.length > 0) {
        newWeirdoId = Math.max(...favorites_data.map(x => x.id))+1;
    }
    weirdo['id'] = newWeirdoId;
    favorites_data.push(weirdo);
    localStorage.setItem('favorites', JSON.stringify(favorites_data));
    // now save the weirdo as normal
    saveWeirdo();
}

// favorited_table

function loadFavoritesTable() {
    const warband_id = document.getElementById('warband_id').value;
    let fav_notice = document.getElementById('fav-notice');
    fav_notice.innerHTML = '';
    document.getElementById('table_area').removeAttribute('hidden');
    if (warband_id == 0) {
        document.getElementById('table_area').setAttribute('hidden',true);
        fav_notice.innerHTML = 'Please save your warband before adding favorites.';
        return;
    }
    let favorites_data = getLocalFavoriteData();
    let fav_table = document.getElementById('favorited_table').tBodies[0];
    deleteEventListeners('.delete_fav');
    deleteEventListeners('.add_fav');
    
    // clear table if has elements
    let tableBody = document.querySelector('#favorited_table tbody'); // Select the table body
    tableBody.innerHTML = ''; // Set the inner HTML to an empty string

    if (favorites_data.length == 0) {
        document.getElementById('table_area').setAttribute('hidden',true);
        fav_notice.innerHTML = 'No favorites set yet.';
        return;
    }
    favorites_data.sort((a, b) => a.cost - b.cost);
    for(const favorite of favorites_data) {
        // build table rows

        let row = fav_table.insertRow();

        let f_name = row.insertCell(0);
        f_name.innerHTML = favorite['name'];
        
        let w_trait = row.insertCell(1);
        w_trait.innerHTML = favorite['cost'];
        

        let buttons = row.insertCell(2);

        let addFavorite = document.createElement('button');
        addFavorite.setAttribute('data-warband_id',warband_id);
        addFavorite.setAttribute('data-id',favorite['id']);
        addFavorite.setAttribute('data-bs-dismiss',"modal"); // close modal
        addFavorite.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'ms-1', 'add_fav');
        addFavorite.innerHTML = `<i style="color:gold;" class="bi bi-star"></i>`;
        addFavorite.title = 'Add Favorite';
        buttons.appendChild(addFavorite);

        let deletebtn = document.createElement('button');
        deletebtn.setAttribute('data-warband_id',warband_id);
        deletebtn.setAttribute('data-id',favorite['id']);
        deletebtn.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'ms-1', 'delete_fav');
        deletebtn.innerHTML = `<i style="color:darkred;" class="bi bi-trash"></i>`;
        deletebtn.title = 'Delete Warband';
        buttons.appendChild(deletebtn);
    }
    // wire event listener for delete
    const delete_btns = document.querySelectorAll('.delete_fav');
    delete_btns.forEach(btn => {
        btn.addEventListener('click', (btn_elem) => {
            const confirmed = confirm("Are you sure you want to delete this favorite?");
            if (!confirmed) {
                return; // Prevent the default action (e.g., form submission)
              }
            let fav_id = btn_elem.target.dataset.id; // delete based on name
            let favorites_data = getLocalFavoriteData();
            const i = favorites_data.findIndex(x => x['id'] == fav_id); // get weirdo index
            if (i>-1) {
                // remove entry from favorite
                favorites_data.splice(i,1);
                localStorage.setItem('favorites', JSON.stringify(favorites_data));
                loadFavoritesTable(); // reload table
            }
        });
    });


    const add_fav_btns = document.querySelectorAll('.add_fav');
    add_fav_btns.forEach(weirdo => {
        weirdo.addEventListener('click', (btn_elem) => {
            let fav_id = btn_elem.target.dataset.id;
            let favorites_data = getLocalFavoriteData();
            const wi = favorites_data.findIndex(x => x['id'] == fav_id); // get fav index
            if (wi<0) {
                console.log('Error: Weirdo not found in favorites');
                return; 
            }

            // remove entry from favorite
            weirdo = favorites_data[wi]
            weirdo['copies'] = 1; 
            delete weirdo['id']; // remove fav id
            loadFavoritesTable(); // reload table

            // add weirdo to warband
            let warband_id = btn_elem.target.dataset.warband_id;
            let local_data = getLocalData();
            const i = local_data['warbands'].findIndex(x => x['warband_id'] == warband_id); // get warband
            
            // get the max id and increase it by 1
            let newWeirdoId = 1;
            if (local_data['warbands'][i]['weirdos'].length > 0) {
                newWeirdoId = Math.max(...local_data['warbands'][i]['weirdos'].map(x => x.weirdo_id))+1;
            }
            weirdo['weirdo_id'] = newWeirdoId;
            // push new weirdo to warband and save it
            local_data['warbands'][i]['weirdos'].push(weirdo);
            localStorage.setItem('warbands', JSON.stringify(local_data));
            loadWeirdoCards(local_data['warbands'][i]); // reload weirdos

        });
    });


      
}
