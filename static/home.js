import {getLocalData, getWarbandPoints, sample_data} from './local_storage.js';
import { deleteEventListeners } from './helpers.js';
window.onload = function() {
    loadWarbandTable();
    document.getElementById('save_json_warband').addEventListener('click', sendSavedWarbandsToClipboard);
    document.getElementById('load_warband_text').addEventListener('click', function() {
        let saved_list = document.getElementById('warband_json_text').value;
        loadWarbandJson(saved_list);
    });
}


function loadWarbandTable() {
    let warbands = getLocalData()['warbands'];
    let w_table = document.getElementById('warband_table');
    deleteEventListeners('.delete_warband');
    deleteEventListeners('.duplicate_warband');
    if (warbands.length == 0) {
        document.getElementById('table_area').setAttribute('hidden',true);
    }
    for(const wbnd of warbands) {
        // build table rows
        let warband_id = wbnd['warband_id']
        let row = w_table.insertRow();
        // let w_id = row.insertCell(0);
        // w_id.innerHTML = warband_id;

        let w_name = row.insertCell(0);
        w_name.innerHTML = wbnd['name'];
        
        let w_trait = row.insertCell(1);
        w_trait.innerHTML = wbnd['warband_trait'];
        
        let w_count = row.insertCell(2);
        w_count.innerHTML = wbnd['weirdos'].length;

        let w_points = row.insertCell(3);
        getWarbandPoints(warband_id).then((pts) => {
            w_points.innerHTML =  pts.points;
          });
        

        let buttons = row.insertCell(4);
        let editbtn = document.createElement('a');
        editbtn.setAttribute('href',"/warband/"+warband_id);
        editbtn.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
        editbtn.innerHTML = `<i style="color:darkgreen;" class="bi bi-pencil-square"></i>`;
        editbtn.title = 'Edit Warband';
        buttons.appendChild(editbtn);

        let duplicatebtn = document.createElement('button');
        duplicatebtn.setAttribute('data-warband_id',warband_id);
        duplicatebtn.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'ms-1', 'duplicate_warband');
        duplicatebtn.innerHTML = `<i style="color:darkgoldenrod;" class="bi bi-copy"></i>`;
        duplicatebtn.title = 'Duplicate Warband';
        buttons.appendChild(duplicatebtn);

        let deletebtn = document.createElement('button');
        deletebtn.setAttribute('data-warband_id',warband_id);
        deletebtn.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'ms-1', 'delete_warband');
        deletebtn.innerHTML = `<i style="color:darkred;" class="bi bi-trash"></i>`;
        deletebtn.title = 'Delete Warband';
        buttons.appendChild(deletebtn);


        let printbtn = document.createElement('a');
        printbtn.setAttribute('href',"/print_warband/"+warband_id);
        // <a href="{{ url_for('print_warband_page', warband_id=warband.warband_id) }}" target="_blank" class="btn btn-secondary ms-3">Print Warband</a>
        printbtn.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'ms-1', 'print_warband');
        printbtn.innerHTML = `<i class="text-primary bi bi-printer"></i>`;
        printbtn.target = '_blank'
        printbtn.title = 'Print Warband';
        buttons.appendChild(printbtn);

    }
    // wire event listener for delete
    const delete_btns = document.querySelectorAll('.delete_warband');
    delete_btns.forEach(btn => {
        btn.addEventListener('click', (btn_elem) => {
            const confirmed = confirm("Are you sure you want to delete this warband?");
            if (!confirmed) {
                return; // Prevent the default action (e.g., form submission)
              }
            let warband_id = btn_elem.target.dataset.warband_id;
            let local_data = getLocalData();
            const i = local_data['warbands'].findIndex(x => x['warband_id'] == warband_id); // get warband
            if (i>-1) {
                // remove entry from warband
                local_data['warbands'].splice(i,1);
                localStorage.setItem('warbands', JSON.stringify(local_data));
                location.reload(); // reload page
            }
        });
    });


    const duplicate_btns = document.querySelectorAll('.duplicate_warband');
    duplicate_btns.forEach(weirdo => {
        weirdo.addEventListener('click', (btn_elem) => {
            let warband_id = btn_elem.target.dataset.warband_id;
            let local_data = getLocalData();
            const i = local_data['warbands'].findIndex(x => x['warband_id'] == warband_id); // get warband
            let warband = {...local_data['warbands'][i]}; // copy warband   
            // get the max id and increase it by 1
            const newId = Math.max(...local_data['warbands'].map(x => x.warband_id))+1;
            warband['warband_id'] = newId;
            local_data['warbands'].push(warband);
            localStorage.setItem('warbands', JSON.stringify(local_data));
            location.reload(); // reload page
        });
    });


    document.getElementById('warband_json_text').value = JSON.stringify(getLocalData());   
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