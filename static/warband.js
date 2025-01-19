// on warband page load
window.onload = function() {
    loadWarband();
    // create new weirdo button
    document.getElementById('create_weirdo').addEventListener('click', function() {
        const warband_id = this.dataset.warband_id;
        // clear form for new weirdo
        document.getElementById('warband_id').value = warband_id;
        document.getElementById('weirdo_id').value = 0;
        document.getElementById('weirdo_name').value = '';
        for (const att of weirdo_attribute) {
            resetSelect(`${att}_select`);
        } 
        // default weapons
        document.querySelector('input[value="Unarmed"][name="melee_radios"]').checked = true;
        document.querySelector('input[value="Auto Pistol"][name="ranged_radios"]').checked = true;
        wireSaveWeirdo();
        updateWeirdoPoints();
    });
    // wire save warband button
    document.getElementById('save_warband').addEventListener('click', function() {
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
            // add warband back into warband list.
            warband_data = getLocalData();
            for (let i = 0; i < warband_data['warbands'].length; i++) {
                if (warband_data['warbands'][i]['warband_id'] == warband_id) {
                    warband_data['warbands'][i] = warband; // swap warband
                }
            }
            localStorage.setItem('warbands', JSON.stringify(warband_data));
            loadWeirdoCards(warband); // reload weirdos
        }
    });

    document.getElementById('weirdo_model').addEventListener('change', updateWeirdoPoints);
}


function getWarband(warband_id) {
    let warband = null;
    const warbands = getLocalData()['warbands'];
    for(const wbnd of warbands) {
        if (wbnd['warband_id'] == warband_id) { // found a saved warband
            warband = wbnd;
        }
    }
    return warband;
}


function getLocalData() {
    const json_warband = localStorage.getItem('warbands');
    if (json_warband != null) {
        return JSON.parse(json_warband);
    }
    return {warbands:[]};
}


function loadWarband() {
    // check warband id
    const warband_id = document.getElementById('warband_id').value;
    warband = getWarband(warband_id);
    if (warband != null) {
        // load warband info
        document.getElementById('warband_text').innerHTML = "Edit Warband";
        // load warband name and trait
        document.getElementById('warband_name').value = warband['name'];
        selectedSelect('warband_trait', warband['warband_trait']);
        selectedSelect('leader_trait', warband['leader_trait']);
        loadWeirdoCards(warband, saved=false); // load weirdos
    } else if (warband_id != 0) { //if id doesn't exist, reload to id 0
        window.location.href = new_warband_url;
    } else {
        document.getElementById('warband_text').innerHTML = "Create Warband";
    }
}


function loadWeirdoCards(warband, saved=true) {
    let weirdos = warband['weirdos'];
    card_container = document.getElementById('weirdo_cards');
    // clear old events
    deleteEventListeners('.edit_weirdo');
    deleteEventListeners('.delete_weirdo');
    deleteEventListeners('.duplicate_weirdo');
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
            new_card.querySelector('.edit_weirdo').setAttribute('data-weirdo_id',weirdo['weirdo_id']);
            new_card.querySelector('.delete_weirdo').setAttribute('data-weirdo_id',weirdo['weirdo_id']);
            new_card.querySelector('.duplicate_weirdo').setAttribute('data-weirdo_id',weirdo['weirdo_id']);
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
            let weapon_card = new_card.querySelector('.card-weapons');
            if (weirdo['ranged_weapon'] != null) {
                weapon_card.querySelector('.ranged').innerHTML = weirdo['ranged_weapon']
            }
            if (weirdo['melee_weapon'] != null) {
                weapon_card.querySelector('.melee').innerHTML = weirdo['melee_weapon']
            }
            // equipment
            let equip_card = new_card.querySelector('.card-equipment');
            if (weirdo['equipment'] != null) {
                for (const equip of weirdo['equipment']) {
                    equip_card.querySelector('.equipment').innerHTML += ` ${equip}&emsp;`;
                }
            }
            if (weirdo['powers'] != null) {
                for (const power of weirdo['powers']) {
                    equip_card.querySelector('.powers').innerHTML += ` ${power}&emsp;`;
                }
            }
            



            card_container.appendChild(new_card);
        }
        // wire Edit buttons
        const edit_btns = document.querySelectorAll('.edit_weirdo');
        edit_btns
        edit_btns.forEach(weirdo => {
            weirdo.addEventListener('click', (wrdo) => {
                load_weirdo_modal(wrdo);
            });
        });
        // wire delete buttons
        const delete_btns = document.querySelectorAll('.delete_weirdo');
        delete_btns.forEach(weirdo => {
            weirdo.addEventListener('click', (btn_elem) => {
                let weirdo_id = btn_elem.target.dataset.weirdo_id;
                let warband_id = document.getElementById('warband_id').value;
                let local_data = getLocalData();

                for(let i=0; i < local_data['warbands'].length; i++) {
                    let warband = local_data['warbands'][i];
                    if (warband['warband_id'] == warband_id) {
                        for(let j=0; j < warband['weirdos'].length; j++) {
                            if (warband['weirdos'][j]['weirdo_id'] == weirdo_id) {
                                local_data['warbands'][i]['weirdos'].splice(j,1);
                                localStorage.setItem('warbands', JSON.stringify(local_data));
                                loadWeirdoCards(warband); // reload weirdos
                            }
                        }
                    }
                }
            });
        });
        const duplicate_btns = document.querySelectorAll('.duplicate_weirdo');
        duplicate_btns.forEach(weirdo => {
            weirdo.addEventListener('click', (btn_elem) => {
                let weirdo_id = btn_elem.target.dataset.weirdo_id;
                let warband_id = document.getElementById('warband_id').value;
                let local_data = getLocalData();

                for(let i=0; i < local_data['warbands'].length; i++) {
                    let warband = local_data['warbands'][i];
                    if (warband['warband_id'] == warband_id) {
                        for(let j=0; j < warband['weirdos'].length; j++) {
                            if (warband['weirdos'][j]['weirdo_id'] == weirdo_id) {
                                let new_weirdo = structuredClone(warband['weirdos'][j]);
                                new_weirdo['weirdo_id'] = getNextWeirdoID(warband);
                                new_weirdo['name'] += ' (c)'
                                warband['weirdos'].push(new_weirdo);
                                localStorage.setItem('warbands', JSON.stringify(local_data));
                                loadWeirdoCards(warband); // reload weirdos
                                return;
                            }
                        }
                    }
                }
            });
        });
        if (saved) {
            fadeInOut('save_alert');  
        }
    });
}

function load_weirdo_modal(wrdo) {
    // load weirdo into modal
    close_accordions();
    let weirdo_id = wrdo.target.dataset.weirdo_id;
    let warband_id = warband['warband_id']
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

    updateWeirdoPoints();         
    wireSaveWeirdo();
}


// get cost of each weirdo stat and post it in relevant places
function deleteEventListeners(id) {
    const items = document.querySelectorAll(id);
    items.forEach(item => {
        item.replaceWith(item.cloneNode(true));
    });
}


function wireSaveWeirdo() {
    document.getElementById('save_weirdo').removeEventListener('click', saveWeirdo);
    document.getElementById('save_weirdo').addEventListener('click', saveWeirdo);
}


function updateWeirdoPoints() {
    let total_points = 0;
    for (const att of weirdo_attribute) {
        total_points += updateWeirdoSelectPoint(att);
    } 
    total_points += updateWeirdoEquipArea();
    document.querySelector('.weirdo_cost').innerHTML = `Cost: ${total_points}`;   
}


// turn first character to upper case
function fUpper(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}


function updateWeirdoSelectPoint(attribute) {
    let text = fUpper(attribute);
    let selector = `${attribute}_select`;
    let s = document.getElementById(selector);
    let cost = s.options[s.selectedIndex].value;
    document.querySelector(`label[for="${selector}"]`).innerHTML = `${text} [${cost}]`
    return parseInt(cost);
}


function updateWeirdoEquipArea() {
    equip_points = 0
    // if firepower is 0, hide ranged weapons and set ranged weapon to auto pistol
    ranged_list = document.getElementById('ranged-weapons-list');
    if (document.getElementById('firepower_select').selectedIndex == 0) {
        ranged_list.setAttribute("hidden", true);
        document.querySelector('input[value="Auto Pistol"][name="ranged_radios"]').checked = true;
    } else {
        ranged_list.removeAttribute("hidden");
    }

    // get weapon selected. Copy over points and other values
    let melee_selected = document.querySelector('input[name="melee_radios"]:checked').closest('.row');
    let _name = melee_selected.querySelector('.form-check-label').innerHTML;
    document.getElementById('e-melee-name').innerHTML = `(Melee) ${_name}`;
    document.getElementById('e-melee-actions').innerHTML = melee_selected.querySelector('.act').innerHTML;
    let melee_pts_area = melee_selected.querySelector('.pts')
    equip_points += parseInt(melee_pts_area.getAttribute('value'));
    document.getElementById('e-melee-points').innerHTML = melee_pts_area.innerHTML;
    document.getElementById('e-melee-notes').innerHTML = melee_selected.querySelector('.notes').innerHTML;

    let ranged_selected = document.querySelector('input[name="ranged_radios"]:checked').closest('.row');
    let _rname = ranged_selected.querySelector('.form-check-label').innerHTML;
    document.getElementById('e-ranged-name').innerHTML = `(Ranged) ${_rname}`;
    document.getElementById('e-ranged-actions').innerHTML = ranged_selected.querySelector('.act').innerHTML;
    let ranged_pts_area = ranged_selected.querySelector('.pts')
    equip_points += parseInt(ranged_pts_area.getAttribute('value'));
    document.getElementById('e-ranged-points').innerHTML = ranged_pts_area.innerHTML;
    document.getElementById('e-ranged-notes').innerHTML = ranged_selected.querySelector('.notes').innerHTML;

    // get selected equipment
    let eq_area = document.getElementById('equipments-area');
    eq_area.innerHTML = '';
    let equipment_boxes = document.querySelectorAll('input[name="equipment_checkbox"]:checked');
    equipment_boxes.forEach((checkbox) => {
        let row = checkbox.closest('.row');
        let points = row.querySelector('.pts').getAttribute('value');
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

function close_accordions() {
    document.querySelectorAll('.accordion .collapse').forEach(function(collapseElement) {
        const bsCollapse = new bootstrap.Collapse(collapseElement, { toggle: false });
        bsCollapse.hide(); // Close all accordion items
    });
}

function getWeirdo(warband_id, weirdo_id) {
    warband = getWarband(warband_id);
    for (weirdo of warband['weirdos']) {
        if (weirdo['weirdo_id'] == weirdo_id) {
            return weirdo;
        }
    }
    return null;
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


function saveWeirdo() {
    // get weirdo information from modal
    let warband_id = document.getElementById('warband_id').value;
    let weirdo_id = document.getElementById('weirdo_id').value;
    let weirdo_name = document.getElementById('weirdo_name').value;
    const weirdo = {
        weirdo_id:weirdo_id,
        name:weirdo_name
    }
    // load attributes into weirdo
    for (const att of weirdo_attribute) {
        let s = document.getElementById(`${att}_select`);
        let item = s.options[s.selectedIndex].text;
        weirdo[att] = item;
    } 
    // get selected radio
    weirdo['melee_weapon'] = document.querySelector('input[name="melee_radios"]:checked').value;
    weirdo['ranged_weapon'] = document.querySelector('input[name="ranged_radios"]:checked').value;
    //equipment
    equipment = []
    const equipment_boxes = document.querySelectorAll('input[name="equipment_checkbox"]');
    equipment_boxes.forEach((checkbox) => {
        if (checkbox.checked) {
            equipment.push(checkbox.value);
        }
    });
    weirdo['equipment'] = equipment;

    //equipment
    powers = []
    const powers_checkbox = document.querySelectorAll('input[name="powers_checkbox"]');
    powers_checkbox.forEach((checkbox) => {
        if (checkbox.checked) {
            powers.push(checkbox.value);
        }
    });
    weirdo['powers'] = powers;

    // first load from local storage
    warband = getWarband(warband_id);   
    // new warband
    if (warband == null) {
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
        warband_data = getLocalData();
        for (let i = 0; i < warband_data['warbands'].length; i++) {
            if (warband_data['warbands'][i]['warband_id'] == warband_id) {
                warband_data['warbands'][i] = warband; // swap warband
            }
        }
        localStorage.setItem('warbands', JSON.stringify(warband_data));
        loadWeirdoCards(warband); // reload weirdos   
    }
}

function saveNewWarband(weirdo=null) {
    // get new warband id
    let new_id = 1;
    warband_data = getLocalData();
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


function selectedSelect(list_name, selected_text) {
    resetSelect(list_name);
    let select_list = document.getElementById(list_name);
    for(let i=0; i < select_list.options.length; i++) {
        if (select_list.options[i].text == selected_text) {
            select_list.options[i].selected = true;
        }
    }
}

function resetSelect(list_name) {
    let select_list = document.getElementById(list_name);
    for(let i=0; i < select_list.options.length; i++) {
        select_list.options[i].selected = false;
    }
    select_list.options[0].selected = true;
}

function fadeInOut(id) {
    const alert = document.getElementById(id);
    // prevent running multiple times
    if (alert.style.opacity < 0) {
        alert.style.opacity = 0;
    }
    if (alert.style.opacity != 0) {
        return;
    }
    let opacity = 0; // Initial opacity
    alert.style.display = 'block'; // Make sure the element is visible
    // Fade in
    const fadeInEffect = setInterval(() => {
        if (opacity >= 1) {
        clearInterval(fadeInEffect); // Stop fade-in
        setTimeout(() => fadeOut(), 500); // Wait 1 second before starting fade-out
        } else {
        opacity += 0.1; // Increase opacity
        alert.style.opacity = opacity;
        }
    }, 50); // Interval of 50ms
    function fadeOut() {
        // Fade out
        const fadeOutEffect = setInterval(() => {
        if (opacity <= 0) {
            clearInterval(fadeOutEffect); // Stop fade-out
            alert.style.display = 'none'; // Hide the element
        } else {
            opacity -= 0.1; // Decrease opacity
            alert.style.opacity = opacity;
        }
        }, 50); // Interval of 50ms
    }
}
  
  
function getWarbandPoints(warband_id) {
    let warband = getWarband(warband_id);
    const url = points_url;
    // call controller
    return fetch(url, 
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json", // Specify JSON format is being sent in body
            },
            body: JSON.stringify(warband), // Convert the model object to a JSON string
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json(); // Parse the JSON response
        })
        // .then((data) => {
        //     return data; // this returns data.points to the fetch.
        // })
        .catch((error) => {
            console.error("Fetch error:", error); // Handle errors
        });
}