window.onload = function() {
    loadWarbandTable();
}

function getLocalData() {
    const json_warband = localStorage.getItem('warbands');
    if (json_warband != null) {
        return JSON.parse(json_warband);
    }
    return {warbands:[]};
}

function loadWarbandTable() {
    let warbands = getLocalData()['warbands'];
    let w_table = document.getElementById('warband_table');
    for(const wbnd of warbands) {
        let row = w_table.insertRow();
        let w_id = row.insertCell(0);
        w_id.innerHTML = wbnd['warband_id'];

        let w_name = row.insertCell(1);
        w_name.innerHTML = wbnd['name'];
        
        let w_trait = row.insertCell(2);
        w_trait.innerHTML = wbnd['trait'];
        
        let w_count = row.insertCell(3);
        w_count.innerHTML = wbnd['weirdos'].length;

        let w_points = row.insertCell(4);
        w_points.innerHTML = 100
        

        let buttons = row.insertCell(5);
        let editbtn = document.createElement('a');
        editbtn.setAttribute('href',"/warband/"+wbnd['warband_id']);
        editbtn.classList.add('btn', 'btn-sm', 'btn-primary');
        editbtn.innerText = "edit";
        buttons.appendChild(editbtn);

        let deletebtn = document.createElement('button');
        deletebtn.setAttribute('data-warband_id',wbnd['warband_id']);
        deletebtn.classList.add('btn', 'btn-sm', 'btn-danger', 'ms-1', 'delete_warband');
        deletebtn.innerText = "delete";
        buttons.appendChild(deletebtn);
    }
    // wire event listener for delete
    const delete_btns = document.querySelectorAll('.delete_warband');
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
}