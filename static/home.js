window.onload = function() {
    loadWarbandTable();
    document.getElementById('save_json_warband').addEventListener('click', sendSavedWarbandsToClipboard);
    document.getElementById('load_warband_text').addEventListener('click', function() {
        let saved_list = document.getElementById('warband_json_text').value;
        loadWarbandJson(saved_list);
    });

}

function getLocalData() {
    const json_warband = localStorage.getItem('warbands');
    if (json_warband != null) {
        return JSON.parse(json_warband);
    }
    return {warbands:[]};
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

function loadWarbandTable() {
    let warbands = getLocalData()['warbands'];
    let w_table = document.getElementById('warband_table');
    for(const wbnd of warbands) {
        // build table rows
        let warband_id = wbnd['warband_id']
        let row = w_table.insertRow();
        let w_id = row.insertCell(0);
        w_id.innerHTML = warband_id;

        let w_name = row.insertCell(1);
        w_name.innerHTML = wbnd['name'];
        
        let w_trait = row.insertCell(2);
        w_trait.innerHTML = wbnd['trait'];
        
        let w_count = row.insertCell(3);
        w_count.innerHTML = wbnd['weirdos'].length;

        let w_points = row.insertCell(4);
        getWarbandPoints(warband_id).then((pts) => {
            w_points.innerHTML =  pts.points;
          });
        

        let buttons = row.insertCell(5);
        let editbtn = document.createElement('a');
        editbtn.setAttribute('href',"/warband/"+warband_id);
        editbtn.classList.add('btn', 'btn-sm', 'btn-primary');
        editbtn.innerText = "edit";
        buttons.appendChild(editbtn);

        let deletebtn = document.createElement('button');
        deletebtn.setAttribute('data-warband_id',warband_id);
        deletebtn.classList.add('btn', 'btn-sm', 'btn-danger', 'ms-1', 'delete_warband');
        deletebtn.innerText = "delete";
        buttons.appendChild(deletebtn);
    }
    // wire event listener for delete
    const delete_btns = document.querySelectorAll('.delete_warband');
    delete_btns.forEach(btn => {
        btn.addEventListener('click', (btn_elem) => {
            const confirmed = confirm("Are you sure you want to delete this warband?");
            if (!confirmed) {
                return; // Prevent the default action (e.g., form submission)
              }
            let _warband_id = btn_elem.target.dataset.warband_id;
            let local_data = getLocalData();
            for(let i=0; i < local_data['warbands'].length; i++) {
                if (local_data['warbands'][i]['warband_id'] == _warband_id) { // found a saved warband
                    // remove entry from warband
                    local_data['warbands'].splice(i,1);
                    localStorage.setItem('warbands', JSON.stringify(local_data));
                    location.reload(); // reload page
                }
            }
        });
    });
    document.getElementById('warband_json_text').value = JSON.stringify(getLocalData());
    
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

function sendSavedWarbandsToClipboard() {
    const json_warband = getLocalData();
    // Copy the text inside the text field
    navigator.clipboard.writeText(JSON.stringify(json_warband));
    // Alert the copied text
    alert("Copied the text to clipboard:\n\n" + JSON.stringify(json_warband));
}

function loadWarbandJson(saved_list) {
    // get value from textbox
    let warbands_json = JSON.parse(document.getElementById('warband_json_text').value);

    // check that the values seem valid
    if (warbands_json['warbands']) {
        localStorage.setItem('warbands', JSON.stringify(warbands_json));
        location.reload();  // reload page (should configure reload warband list instead)
    } else {
        alert("json is missing warbands. Double check it is formated correctly.");
    }
}