
const sample_data = { warbands:[
    {
      warband_id: 4,
      name: "Robot Legion",
      warband_trait: "Undead",
      leader_trait: "Monstrous",
      weirdos: [
        { weirdo_id: 1, name: "Overlord", copies: 1, speed: 3, defense: "2d10", firepower: "2d8", prowess: "2d8", willpower: "2d10", melee_weapon: "Claws & Teeth", ranged_weapon: "Auto Pistol", equipment: [], powers: [] },
        { weirdo_id: 2, name: "Deathmark", copies: 1, speed: 3, defense: "2d8", firepower: "2d8", prowess: "2d6", willpower: "2d8", melee_weapon: "Melee Weapon", ranged_weapon: "Sniper Rifle", equipment: ["Targeting Reticule"], powers: [] },
        { weirdo_id: 3, name: "Warrior", copies: 4, speed: 2, defense: "2d8", firepower: "2d8", prowess: "2d8", willpower: "2d6", melee_weapon: "Melee Weapon", ranged_weapon: "Auto Rifle", equipment: [], powers: [] },
        { weirdo_id: 4, name: "Immortal", copies: 1, speed: 2, defense: "2d10", firepower: "2d10", prowess: "2d6", willpower: "2d6", melee_weapon: "Melee Weapon", ranged_weapon: "Heavy Rifle", equipment: [], powers: [] }
      ]
    },
    {
      warband_id: 5,
      name: "Forces of Sol",
      warband_trait: "Fanatics",
      leader_trait: "Tactician",
      weirdos: [
        { weirdo_id: 1, name: "Commander", copies: 1, speed: 3, defense: "2d8", firepower: "2d10", prowess: "2d8", willpower: "2d8", melee_weapon: "Powered Weapon", ranged_weapon: "Energy Pistol", equipment: ["Cybernetics", "Targeting Reticule"], powers: [] },
        { weirdo_id: 3, name: "Trooper", copies: 4, speed: 2, defense: "2d6", firepower: "2d8", prowess: "2d8", willpower: "2d8", melee_weapon: "Melee Weapon", ranged_weapon: "Auto Rifle", equipment: [], powers: [] },
        { weirdo_id: 4, name: "Rocket Launcher", copies: 1, speed: 2, defense: "2d8", firepower: "2d10", prowess: "2d8", willpower: "2d6", melee_weapon: "Melee Weapon", ranged_weapon: "Rocket Launcher", equipment: ["Heavy Armor"], powers: [] },
        { weirdo_id: 5, name: "Sniper", copies: 1, speed: 2, defense: "2d8", firepower: "2d10", prowess: "2d6", willpower: "2d8", melee_weapon: "Melee Weapon", ranged_weapon: "Sniper Rifle", equipment: ["Targeting Reticule"], powers: [] }
      ]
    }
  ]};

function getLocalData() {
    const json_warband = localStorage.getItem('warbands');
    if (json_warband != null) {
        return JSON.parse(json_warband);
    }
    return {warbands:[]};
}

function getLocalFavoriteData() {
    const json_favorites = localStorage.getItem('favorites');
    if (json_favorites != null) {
        return JSON.parse(json_favorites);
    }
    return {favorites:[]};
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


export {getLocalData, getLocalFavoriteData, getWarband, getWarbandPoints, getWeirdo, getTraitsText, getWeirdoEquipmentInfo, sample_data};

