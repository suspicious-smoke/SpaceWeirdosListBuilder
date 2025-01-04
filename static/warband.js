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
            loadWeirdoCards(warband); // reload weirdos
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
        loadWeirdoCards(warband, saved=false);
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
    card_container.innerHTML = '';
    getWarbandPoints(warband['warband_id']).then((data) => {
        // create new card for each weirdo
        for (const weirdo of weirdos) {
            let weirdo_cost = 0
            // get weirdo points
            for (const w_pts of data.weirdos) {
                if (weirdo['weirdo_id'] == w_pts.id) {
                    weirdo_cost = w_pts.points
                }
            }
            let template_card = document.getElementById('card_template');
            let new_card = template_card.cloneNode(true);
            
            new_card.removeAttribute("hidden");
            new_card.removeAttribute("id");
            new_card.querySelector('.edit_weirdo').setAttribute('data-weirdo_id',weirdo['weirdo_id']);
            new_card.querySelector('.delete_weirdo').setAttribute('data-weirdo_id',weirdo['weirdo_id']);

            new_card.querySelector('.card-title').innerHTML = weirdo['name'];
            new_card.querySelector('.card-cost').innerHTML = `cost: ${weirdo_cost}`;
            new_card.querySelector('.card-spd').innerHTML += weirdo['speed'];
            new_card.querySelector('.card-def').innerHTML += weirdo['defense'];    
            card_container.appendChild(new_card);
        }
        // wire Edit buttons
        const edit_btns = document.querySelectorAll('.edit_weirdo');
        edit_btns
        edit_btns.forEach(weirdo => {
            weirdo.addEventListener('click', (wrdo) => {
                let weirdo_id = wrdo.target.dataset.weirdo_id;
                let warband_id = warband['warband_id']
                document.getElementById('warband_id').value = warband_id;
                document.getElementById('weirdo_id').value = weirdo_id;
                let weirdo = getWeirdo(warband_id, weirdo_id);
                document.getElementById('weirdo_name').value = weirdo['name'];
                selectedSelect('speed_select', weirdo['speed']);
                selectedSelect('defense_select', weirdo['defense']);
                wireSaveWeirdo();
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
        if (saved) {
            fadeInOut('save_alert');  
        }
    });
    
    
}

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

function fadeInOut(id) {
    const alert = document.getElementById(id);
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