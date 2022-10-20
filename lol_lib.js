import { con } from './db.js';
import { promisify } from 'util';
const query = promisify(con.query).bind(con);
import * as lol_api from './LOL_API.js';

let ddragon_ver = `12.13.1`;
import ddragon_champions from './data_files/12.13.1/champion.json' assert { type: 'json' };
async function test_GetLOLGame() {
    const result = await query('SELECT * FROM lol_games WHERE ID = 1');
    return result;
}

async function getSummonersToMonitor() {
    const result = await query('SELECT * FROM discord_summoners WHERE monitorYN = 1');
    return result;
}


async function updateEncryptedSummonerId(LOL_summonerName, LOL_encryptedSummonerId) {
    let set = {
        LOL_encryptedSummonerId: LOL_encryptedSummonerId,
    };
    let where = {
        LOL_summonerName: LOL_summonerName,
    };
    let sql = 'UPDATE `discord_summoners` SET ? WHERE ?';
    const result = await query(sql, [set, where]);
    return result;
}

function isSummonerAParticipant(summoner_name, participants) {
    let summoner_is_participant = false;
    for (let i = 0; i < participants.length; i++) {
        if (summoner_name == participants[i].summonerName) {
            summoner_is_participant = true;
        }
    }
    return summoner_is_participant;
}

async function addWatchedGame(game_id, game_type, summonerName) {
    let values = [game_id];
    let sql = 'SELECT * FROM lol_games WHERE gameId = ?';
    let result = await query(sql, [values]);
    if (result.length == 0) {
        values = [game_id, game_type, summonerName];
        sql = 'INSERT INTO lol_games (`gameId`, `gameType`, `summonerName`) VALUES (?)';
        result = await query(sql, [values]);
    }

    return result;
}

async function imageCreatedForWatchedGame(game_id) {
    let values = [game_id];
    let sql = 'UPDATE `lol_games` SET `imageCreatedYN`=1 WHERE `gameId`=?';
    const result = await query(sql, [values]);
    return result;
}



async function hasImageBeenCreated(game_id) {
    let values = [game_id];
    let sql = 'SELECT * FROM `lol_games` WHERE `gameId`=? AND imageCreatedYN=1';
    const result = await query(sql, [values]);
    if (result.length > 0) {
        return true;
    }
    return false;
}

async function refreshEncryptedIds() {
    let summoners_to_monitor = await getSummonersToMonitor();
    let the_responses = await lol_api.getAllSummonerData(summoners_to_monitor)

    for (let i = 0; i < the_responses.length; i++) {
        if (the_responses[i].status == 200) {
            await updateEncryptedSummonerId(summoners_to_monitor[i].LOL_summonerName, the_responses[i].data.id);
        }
    }
    console.log("Refreshed encryptedSummonerIds")
}

async function getActiveGames(summoners_to_monitor) {
    let active_games = []

    let the_responses = await lol_api.getAllActiveGamesBySummonerIds(summoners_to_monitor);
    for (let i = 0; i < the_responses.length; i++) {
        if (the_responses[i].status == 200) {
            if (the_responses[i].data.gameMode == "ARAM") {
                the_responses[i].data.summonerName = summoners_to_monitor[i].LOL_summonerName;
                active_games.push(the_responses[i].data);
            } else {
            }
        }

    }

    return active_games;
}

async function getSummmonerMMRForActiveGame(active_game_data) {
    let blue_team = { avg_mmr: 0, participants: [] };
    let red_team = { avg_mmr: 0, participants: [] };
    let mmr_data_obj = {};
    let red_team_mmr_counter = 0;
    let blue_team_mmr_counter = 0;
    let red_team_mmr_sum = 0;
    let blue_team_mmr_sum = 0;
    let mmr_value = "";

    let the_responses = await lol_api.getAllSummonerMMR(active_game_data);

    //loop through active game participants to get their MMR
    for (let i = 0; i < active_game_data.participants.length; i++) {
        if (the_responses[i].status == 200) {
            mmr_value = the_responses[i].data.ARAM.avg || " - ";
        } else if (the_responses[i].status == 404) {
            mmr_value = " - ";
        } else {
            mmr_value = " - ";
        }

        // Loop through each champion until we get match between
        let data = ddragon_champions.data;
        let champion_icon_url = "";
        for (const champ in data) {
            if (data[champ].key == active_game_data.participants[i].championId) {
                champion_icon_url = `http://ddragon.leagueoflegends.com/cdn/${ddragon_ver}/img/champion/${data[champ].image.full}`;

            }
        }

        //100 = red
        //200 = blue
        if (active_game_data.participants[i].teamId == 100) {
            if (mmr_value > 0) {
                red_team_mmr_sum += mmr_value;
                red_team_mmr_counter += 1;
            }
            red_team.participants.push({
                summoner_name: active_game_data.participants[i].summonerName,
                champion_id: champion_icon_url,
                mmr: mmr_value,
            });
        } else {
            if (mmr_value > 0) {
                blue_team_mmr_sum += mmr_value;
                blue_team_mmr_counter += 1;
            }
            blue_team.participants.push({
                summoner_name: active_game_data.participants[i].summonerName,
                champion_id: champion_icon_url,
                mmr: mmr_value,
            });
        }
    }

    red_team.avg_mmr = Math.round(red_team_mmr_sum / red_team_mmr_counter);
    blue_team.avg_mmr = Math.round(blue_team_mmr_sum / blue_team_mmr_counter);

    mmr_data_obj.red_team = red_team;
    mmr_data_obj.blue_team = blue_team;

    let now = new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
    mmr_data_obj.time_stamp = `${now} EST`;
    return mmr_data_obj;

}

export {
    getSummonersToMonitor,
    isSummonerAParticipant,
    addWatchedGame,
    imageCreatedForWatchedGame,
    hasImageBeenCreated,
    updateEncryptedSummonerId,
    refreshEncryptedIds,
    getActiveGames,
    test_GetLOLGame,
    getSummmonerMMRForActiveGame,
};