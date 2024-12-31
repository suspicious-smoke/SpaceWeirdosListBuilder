window.onload = function() {
    // button to save flask data
    // document.getElementById('load_data_example').addEventListener('click', function() {
    //     let token = localStorage.setItem('token','yayayaya token')
    //     document.getElementById('response').textContent = 'added'
    //     // fetch('http://127.0.0.1:5000/postdata', {
    //     //     method: 'POST',  // HTTP method
    //     //     headers: {
    //     //         'Content-Type': 'application/json',  // Specify that we are sending JSON
    //     //     },
    //     //     body: JSON.stringify(token)  // Convert the data object into a JSON string
    //     // })
    //     // .then(response => response.json())  // Parse JSON response from Flask server
    //     // .then(data => {
    //     //     console.log('Success:', data);
    //     //     alert('Server Response: ' + data.message);
    //     // })
    //     // .catch((error) => {
    //     //     console.error('Error:', error);
    //     //     alert('Failed to send data');
    //     // });
    // });
    // document.getElementById('delete_data_example').addEventListener('click', function() {
    //     localStorage.removeItem('token')
    //     document.getElementById('response').textContent = 'deleted'
    // });


    document.getElementById('create_weirdo').addEventListener('click', function() {
        const warband_id = this.dataset.warband_id;
        const weirdo_id = 0;
        // clear form for new weirdo


        // fetch('/get_weirdo/'+warband_id+'/'+weirdo_id)
        //     .then(response => response.json())
        //     .then(w_data => { // data is a parsed JSON object
        //         document.getElementById('weirdo_name').value = w_data.name;
        //     });
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
        // reload page
        
    });
}

function saveWeirdo() {
    // get weirdo information
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
    // fetch('/get_weirdo/'+warband_id+'/'+weirdo_id)
        //     .then(response => response.json())
        //     .then(w_data => { // data is a parsed JSON object
        //         document.getElementById('weirdo_name').value = w_data.name;
        //     });

    // first load from local storage
    // check warband id
    // check weirdo id's

}
