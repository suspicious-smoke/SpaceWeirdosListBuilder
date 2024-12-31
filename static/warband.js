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
    
    document.getElementById('load_weirdo').addEventListener('click', function() {
        const weirdo = JSON.parse(localStorage.getItem("warband_0"));
        document.getElementById('weirdo_id').value = weirdo.weirdo_id;
        document.getElementById('weirdo_name').value = weirdo.weirdo_name;
    });

}


function wireSaveWeirdo() {
    document.getElementById('save_weirdo').addEventListener('click', function() {
        saveWeirdo();
    });
}

function loadWarband() {
    // check warband id
    const warband_id = document.getElementById('warband_id').value

    const json_warband = localStorage.getItem('warbands');
    let warband = null;

    if (json_warband != null) {
        const warbands = JSON.parse(json_warband)['warbands'];
        for (const wbnd of warbands) {
            if (wbnd['warband_id']==warband_id) { // found a saved warband
                warband = wbnd;
            }
        }
    }
    
    if (warband==null && warband_id != 0) { //if id doesn't exist, reload to id 0
        window.location.href = new_warband_url;
    } else if (warband_id == 0) {
        document.getElementById('warband_text').innerHTML = "Create Warband";
    } else {
        document.getElementById('warband_text').innerHTML = "Edit Warband";
    }

    // fill in table with warband information

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
    // put weirdo into object for transport
    const weirdo = {
        weirdo_id:weirdo_id,weirdo_name,weirdo_name,
        speed:speed,
        defense:defense,
    }
    // first load from local storage
    
    // check warband id
    // check weirdo id's

    json_weirdo = JSON.stringify(weirdo); // convert to json
    // save to local storage
    localStorage.setItem('warband_'+warband_id,json_weirdo)
    location.reload(); // reload page
}

function resetSelect(list_name) {
    let select_list = document.getElementById(list_name);
    for (let i=0; i < select_list.options.length; i++) {
        select_list.options[i].selected = false;
    }
    select_list.options[0].selected = true;
}