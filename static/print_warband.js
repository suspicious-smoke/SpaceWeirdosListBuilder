import {getLocalData, getWarband, getWarbandPoints} from './local_storage.js';

window.onload = function() {
    const warband_id = document.getElementById('warband_id').value;
    let warband = getWarband(warband_id);
    document.getElementById('warband_name').innerHTML =  warband.name;
    document.getElementById('warband_trait').innerHTML =  warband.warband_trait;
    document.getElementById('leader_trait').innerHTML =  warband.leader_trait;
    let x = 4;
}
