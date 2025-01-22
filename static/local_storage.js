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

export {getLocalData, getWarband};