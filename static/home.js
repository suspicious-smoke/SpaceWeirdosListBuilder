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

        let w_points = row.insertCell(3);
        w_points.innerHTML = 100

        // let buttons = row.insertCell(4);
        // var aTag = document.createElement('a');
        // aTag.setAttribute('href',"yourlink.htm");
        // aTag.classList.add("btn btn-sm btn-primary");
        // aTag.innerText = "link text";
        // buttons.appendChild();
    }



}