import {getWarband, getWarbandPoints} from './local_storage.js';


function getWeirdoEquipmentInfo(warband) {
    // call controller
    return fetch(equip_url, 
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
        .then((data) => {
            return data; // this returns data to the fetch.
        })
        .catch((error) => {
            console.error("Fetch error:", error); // Handle errors
        });
}

function getTraitsText(warband_trait, leader_trait) {
    // call controller
    return fetch(traits_url, 
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json", // Specify JSON format is being sent in body
            },
            body: JSON.stringify([warband_trait,leader_trait]), // Convert the model object to a JSON string
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
            new_card.querySelector('.ranged-weapon').innerHTML = weirdo['ranged_weapon']
            if (weirdo['firepower'] == 0) {
                new_card.querySelector('.ranged-weapon').innerHTML = '&ensp;-'
            }
            new_card.querySelector('.melee-weapon').innerHTML = weirdo['melee_weapon']


            
            // equipment
            if (weirdo['equipment'].length != 0) {
                for (const equip of weirdo['equipment']) {
                    new_card.querySelector('.equipment').innerHTML += ` ${equip}<br>`;
                }
            } else {
                new_card.querySelector('.equipment').innerHTML = '&ensp;-'
            }
            if (weirdo['powers'].length != 0) {
                for (const power of weirdo['powers']) {
                    new_card.querySelector('.powers').innerHTML += ` ${power}<br>`;
                }
            } else {
                new_card.querySelector('.powers').innerHTML = '&ensp;-'
            }
            card_container.appendChild(new_card);
        }
    });



} 

