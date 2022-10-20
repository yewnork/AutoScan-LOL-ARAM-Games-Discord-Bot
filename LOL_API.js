import * as config_data from './config.js';
const LOL_API_KEY = config_data.LOL_API_KEY;
const LOL_API_BASE_URL = "https://na1.api.riotgames.com";
const LOL_API_SUMMONER = "/lol/summoner/v4/summoners/by-name/";
const LOL_API_SPECTATOR = "/lol/spectator/v4/active-games/by-summoner/";

const MMRSITE_BASE_URL = "https://na.whatismymmr.com";
const MMRSITE_SUMMONER = "/api/v1/summoner?name=";
import ax from 'axios';
const { get, all } = ax;


function buildSummonerDataUrl(summoner_name) {
    return encodeURI(LOL_API_BASE_URL + LOL_API_SUMMONER + summoner_name);
}

async function getAllSummonerData(summoners_to_monitor) {
    let axiosArray = [];
    let the_responses = []
    for (let i = 0; i < summoners_to_monitor.length; i++) {
        let url = buildSummonerDataUrl(summoners_to_monitor[i].LOL_summonerName);
        let newPromise = get(url, {
            validateStatus: false,
            params: {
                'api_key': LOL_API_KEY,
            }
        });
        axiosArray.push(newPromise);

    }

    await all(axiosArray)
        .then(result => {
            the_responses = result;
        });

    return the_responses;
}


async function getSummonerData(summoner_name) {
    let url = buildSummonerDataUrl(summoner_name);
    return await get(url, {
        params: {
            'api_key': LOL_API_KEY,
        }
    })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error.response;
        });
}






async function getActiveGameBySummonerId(summoner_id) {
    url = encodeURI(LOL_API_BASE_URL + LOL_API_SPECTATOR + summoner_id);
    return await get(url, {
        params: {
            'api_key': LOL_API_KEY,
        }
    })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error.response;
        });
}


async function getAllActiveGamesBySummonerIds(summoners_to_monitor) {
    let axiosArray = [];
    let the_responses = [];
    for (let i = 0; i < summoners_to_monitor.length; i++) {
        let url = encodeURI(LOL_API_BASE_URL + LOL_API_SPECTATOR + summoners_to_monitor[i].LOL_encryptedSummonerId);
        let newPromise = get(url, {
            validateStatus: false,
            params: {
                'api_key': LOL_API_KEY,
            }
        });
        axiosArray.push(newPromise);

    }

    await all(axiosArray)
        .then(result => {
            the_responses = result;
        });

    return the_responses;
}

async function getSummonerMMR(summoner_name) {

    url = encodeURI(MMRSITE_BASE_URL + MMRSITE_SUMMONER + summoner_name);
    return await get(url)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error.response;
        });

}

async function getAllSummonerMMR(active_game_data) {
    let axiosArray = [];
    let the_responses;

    for (let i = 0; i < active_game_data.participants.length; i++) {
        let url = encodeURI(MMRSITE_BASE_URL + MMRSITE_SUMMONER + active_game_data.participants[i].summonerName);
        let newPromise = get(url, { validateStatus: false });
        axiosArray.push(newPromise);

    }
    await all(axiosArray)
        .then(result => {
            the_responses = result;
        });

    return the_responses;
}


export {
    getSummonerMMR,
    getSummonerData,
    getActiveGameBySummonerId,
    getAllSummonerMMR,
    getAllSummonerData,
    getAllActiveGamesBySummonerIds,
};