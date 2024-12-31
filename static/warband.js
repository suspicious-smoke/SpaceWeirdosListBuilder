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
}


function loadWarband() {
    // check warband id
    const warband_id = document.getElementById('warband_id').value
    const json_warband = localStorage.getItem('warbands');
    let warband = null;

    // try to load the specific warband
    if (json_warband != null) {
        const warbands = JSON.parse(json_warband)['warbands'];
        for(const wbnd of warbands) {
            if (wbnd['warband_id']==warband_id) { // found a saved warband
                warband = wbnd;
            }
        }
    }
    if (warband!= null) {
        // load warband info
        document.getElementById('warband_text').innerHTML = "Edit Warband";
        // load warband name and trait

        // load weirdos from warband
        let weirdos = warband['weirdos'];
        card_container = document.getElementById('weirdo_cards');
        for (const weirdo of weirdos) {
            const content = 
            `
            <div class="mt-3 col-sm-6 weirdo_card">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${weirdo['weirdo_name']}</h5>
                        <!-- <p class="card-text">With supporting text below as a natural lead-in to additional content.</p> -->
                        <div class="row mb-3">
                            <div class="col 2"><b>Speed:</b> ${weirdo['speed']}</div>
                            <div class="col 2"><b>Defense:</b> ${weirdo['defense']}</div>
                            <div class="col 2"><b>Firepower:</b> </div>
                            <div class="col 2"><b>Prowess:</b> </div>
                            <div class="col 2"><b>Willpower:</b> </div>
                        </div>
                        <div class="float-end">
                            <button type="button" class="btn btn-sm btn-primary load_weirdo">Edit</button>
                            <button type="button" class="btn btn-sm btn-danger bs-4 delete_weirdo">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            card_container.innerHTML += content;
        }
        

    } else if (warband_id != 0) { //if id doesn't exist, reload to id 0
        window.location.href = new_warband_url;
    } else {
        document.getElementById('warband_text').innerHTML = "Create Warband";
    }
}


function wireSaveWeirdo() {
    document.getElementById('save_weirdo').addEventListener('click', function() {
        saveWeirdo();
    });
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
    for(let i=0; i < select_list.options.length; i++) {
        select_list.options[i].selected = false;
    }
    select_list.options[0].selected = true;
}