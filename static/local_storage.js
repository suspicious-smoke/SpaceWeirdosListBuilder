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

async function getWarbandPoints(warband_id) {
    let warband = getWarband(warband_id);
    const url = points_url;
    // call controller
    try {
        const response = await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Specify JSON format is being sent in body
                },
                body: JSON.stringify(warband), // Convert the model object to a JSON string
            });
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error); // Handle errors
    }
}

function getWeirdo(warband_id, weirdo_id) {
    let warband = getWarband(warband_id);
    for (const weirdo of warband['weirdos']) {
        if (weirdo['weirdo_id'] == weirdo_id) {
            return weirdo;
        }
    }
    return null;
}


async function getWeirdoEquipmentInfo(weirdo) {
    // call controller
    try {
        const response = await fetch(equip_url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Specify JSON format is being sent in body
                },
                body: JSON.stringify(weirdo), // Convert the model object to a JSON string
            });
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error); // Handle errors
    }
}

async function getTraitsText(warband_trait, leader_trait) {
    // call controller
    try {
        const response = await fetch(traits_url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Specify JSON format is being sent in body
                },
                body: JSON.stringify([warband_trait, leader_trait]), // Convert the model object to a JSON string
            });
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error); // Handle errors
    }
}


export {getLocalData, getWarband, getWarbandPoints, getWeirdo, getTraitsText, getWeirdoEquipmentInfo};

