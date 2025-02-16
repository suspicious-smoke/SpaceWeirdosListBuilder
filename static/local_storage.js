function getLocalData() {
    const json_warband = localStorage.getItem('warbands');
    if (json_warband != null) {
        return JSON.parse(json_warband);
    }
    return {warbands:[]};
}

// return a list of favorite weirdos
function getLocalFavoriteData() {
    const json_favorites = localStorage.getItem('favorites');
    if (json_favorites != null) {
        return JSON.parse(json_favorites);
    }
    return [];
}


function getWarband(warband_id) {
    const warbands = getLocalData()['warbands'];
    return warbands.find(wbnd => wbnd.warband_id == warband_id);
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
    return warband['weirdos'].find(x => x.weirdo_id == weirdo_id);
}

export {getLocalData, getLocalFavoriteData, getWarband, getWarbandPoints, getWeirdo };

