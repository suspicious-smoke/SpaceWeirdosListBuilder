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
        resetSelect('speed_select');
        resetSelect('defense_select');
        wireSaveWeirdo();
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
            warband['trait'] = t.options[t.selectedIndex].text;
            // add warband back into warband list.
            warband_data = getLocalData();
            for (let i = 0; i < warband_data['warbands'].length; i++) {
                if (warband_data['warbands'][i]['warband_id'] == warband_id) {
                    warband_data['warbands'][i] = warband; // swap warband
                }
            }
            localStorage.setItem('warbands', JSON.stringify(warband_data));
            location.reload(); // reload page
        }
    });
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
        selectedSelect('warband_trait', warband['trait']);

        // load weirdos from warband
        let weirdos = warband['weirdos'];
        card_container = document.getElementById('weirdo_cards');
        // create new card for each weirdo
        for (const weirdo of weirdos) {
            let template_card = document.getElementById('card_template');
            let new_card = template_card.cloneNode(true);
            new_card.removeAttribute("hidden");
            new_card.removeAttribute("id");
            new_card.querySelector('.edit_weirdo').setAttribute('data-weirdo_id',weirdo['weirdo_id']);
            new_card.querySelector('.card-title').innerHTML = weirdo['name'];
            new_card.querySelector('.card-spd').innerHTML += weirdo['speed'];
            new_card.querySelector('.card-def').innerHTML += weirdo['defense'];    
            card_container.appendChild(new_card);
        }
    } else if (warband_id != 0) { //if id doesn't exist, reload to id 0
        window.location.href = new_warband_url;
    } else {
        document.getElementById('warband_text').innerHTML = "Create Warband";
    }

    // wire edit/delete buttons
    const weirdo_edits = document.querySelectorAll('.edit_weirdo');

    // Add a click event listener to each element
    weirdo_edits.forEach(weirdo => {
        weirdo.addEventListener('click', (wrdo) => {
            let weirdo_id = wrdo.target.dataset.weirdo_id;
            document.getElementById('warband_id').value = warband_id;
            document.getElementById('weirdo_id').value = weirdo_id;
            let weirdo = getWeirdo(warband_id, weirdo_id);
            document.getElementById('weirdo_name').value = weirdo['name'];
            selectedSelect('speed_select', weirdo['speed']);
            selectedSelect('defense_select', weirdo['defense']);
            wireSaveWeirdo();
        });
    });
}


function wireSaveWeirdo() {
    document.getElementById('save_weirdo').addEventListener('click', function() {
        saveWeirdo();
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

function saveWeirdo() {
    // get weirdo information from modal
    let warband_id = document.getElementById('warband_id').value;
    let weirdo_id = document.getElementById('weirdo_id').value;
    let weirdo_name = document.getElementById('weirdo_name').value;

    let s = document.getElementById('speed_select');
    let speed = s.options[s.selectedIndex].text;
    let d = document.getElementById('defense_select');
    let defense = d.options[d.selectedIndex].text;
    const weirdo = {
        weirdo_id:weirdo_id,
        name:weirdo_name,
        speed:speed,
        defense:defense
    }
    // first load from local storage
    warband = getWarband(warband_id);
    
    // new warband
    if (warband == null) {
        saveNewWarband(weirdo);
    } else {
        // warband exists:
        warband['name'] = document.getElementById('warband_name').value;
        let t = document.getElementById('warband_trait');
        warband['trait'] = t.options[t.selectedIndex].text;
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
        location.reload(); // reload page
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
    let trait = t.options[t.selectedIndex].text;
    const new_warband = {
        warband_id: new_id,
        name: document.getElementById('warband_name').value,
        trait: trait,
        weirdos: []
    }

    if (weirdo != null) {
        weirdo['weirdo_id'] = 1;
        new_warband['weirdos'].push(weirdo);
    }

    warband_data['warbands'].push(new_warband);
    localStorage.setItem('warbands', JSON.stringify(warband_data));
    //redirect to new page
    window.location.href = '/warband/'+new_id;
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