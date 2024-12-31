window.onload = function() {
    // check warband id

    
    // create new weirdo button
    document.getElementById('create_weirdo').addEventListener('click', function() {
        const warband_id = this.dataset.warband_id;
        const weirdo_id = 0;
        // clear form for new weirdo
        
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

function saveWeirdo() {
    // get weirdo information from modal
    let weirdo_id = document.getElementById('weirdo_id').value;
    let warband_id = document.getElementById('warband_id').value;
    let weirdo_name = document.getElementById('weirdo_name').value;

    let s = document.getElementById('speed_select');
    let speed = s.options[s.selectedIndex].text;
    let d = document.getElementById('defense_select');
    let defense = d.options[d.selectedIndex].text;
    // put weirdo into object for transport
    const weirdo = {
        weirdo_id:weirdo_id,warband_id:warband_id,weirdo_name,weirdo_name,
        speed:speed,
        defense:defense,
    }
    json_weirdo = JSON.stringify(weirdo); // convert to json
    // save to local storage
    localStorage.setItem('warband_'+warband_id,json_weirdo)
    
    
    location.reload(); // reload page
    // first load from local storage
    // check warband id
    // check weirdo id's
}
