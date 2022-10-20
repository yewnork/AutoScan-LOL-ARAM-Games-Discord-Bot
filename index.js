import * as config_data from './config.js';
const token = config_data.token;

import hb from 'handlebars';
const { compile } = hb;

import nodeHtmlToImage from 'node-html-to-image';
import { promises as fs } from 'fs';
import { Client, Intents, MessageAttachment } from 'discord.js';
import * as helpers from './helpers/helpers.js';
import * as lol_lib from './lol_lib.js';


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


client.once('ready', () => {
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("-----------------------------------------------");
    console.log("--------   Poll/Monitor Active Games   --------");
    console.log("-----------------------------------------------");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(" ");
    console.log(" ");
    console.log(" ");

    client.user.setActivity('Idle...');
    const channel = client.channels.cache.get(config_data.channelId);

    const loop_interval = 1000 * 60; //60 seconds loop interval

    let timerId = setTimeout(function tick() {
        console.log("Start:", helpers.CurrentDateTime());
        console.log(`Loop Every ${loop_interval / 1000} Seconds`);
        client.user.setActivity('Waiting for games to start...', { type: 'LISTENING' });
        (async function () {

            // Refresh Summoner IDS 
            await lol_lib.refreshEncryptedIds();

            let active_games = [];
            let summoners_to_monitor_str = "";

            // Load the Summoners that we are monitoring
            let summoners_to_monitor = await lol_lib.getSummonersToMonitor(); 
            for (let i = 0; i < summoners_to_monitor.length; i++) {
                summoners_to_monitor_str += `| ${summoners_to_monitor[i].LOL_summonerName} |`;
            }
            console.log("Monitoring Games For: ", summoners_to_monitor_str)

            // Get all of the Active Games for the summoners we are monitoring
            active_games = await lol_lib.getActiveGames(summoners_to_monitor);

            if (active_games.length == 0) { //Foreach GamesObjArray
                console.log(`No Active Games Found`);

            } else {

                // If there are Active Games...
                // Lets loop through them
                for (let i = 0; i < active_games.length; i++) {
                    // Check the DB see if an image for this Active game as been made
                    let image_has_been_created = await lol_lib.hasImageBeenCreated(active_games[i].gameId);

                    if (image_has_been_created == true) {
                        console.log(`Already Posted Image For ${active_games[i].summonerName}'s Game: ${active_games[i].gameId}`);
                    } else {
                        // Add the Active Game to the DB
                        await lol_lib.addWatchedGame(active_games[i].gameId, active_games[i].gameMode, active_games[i].summonerName); 

                        // Image hasnt been posted to the Discord Yet...
                        client.user.setActivity('Getting MMR!', { type: 'PLAYING' });
                        console.log(`Getting MMR Data For ${active_games[i].summonerName}'s Game: ${active_games[i].gameId}`);

                        // Get the Summoner MMR data for everyone in this Active Game
                        let data = await lol_lib.getSummmonerMMRForActiveGame(active_games[i]); 
                        data.summoner_name_main = active_games[i].summonerName;

                        console.log(`Creating & Posting Image For ${active_games[i].summonerName}'s Game: ${active_games[i].gameId}`);

                        // Load Html Template file and compile it with the MMR Data
                        const _htmlTemplate = await fs.readFile("./templates/handlebars/aram_game.html", "binary");
                        var template = compile(_htmlTemplate);
                        var html = template(data);

                        const file_name = `${data.summoner_name_main}-${helpers.CurrentDateTimeForFileName()}.png`;

                        // Create the image off the the html template
                        const image = await nodeHtmlToImage({
                            html: html,
                            quality: 100,
                            type: 'png',
                            puppeteerArgs: {
                                args: ['--no-sandbox'],
                            },
                            encoding: 'buffer',
                            output: `./html_to_image/${file_name}`,
                        });

                        // Create the image attachment for Discord
                        const image_attachment = new MessageAttachment(image, file_name);

                        // Send a message to the discord with the Image!
                        const message = await channel.send({ files: [image_attachment] });

                        // Update the Game in the DB saying an image as been created
                        await lol_lib.imageCreatedForWatchedGame(active_games[i].gameId); //GameObj->save? //Also, save image to DB,etc

                    }
                }


            }

            client.user.setActivity('Waiting for games to start...', { type: 'LISTENING' });
            console.log("End:", helpers.CurrentDateTime());
            console.log("--------------------------------------------------");
        })();



        timerId = setTimeout(tick, loop_interval);

    }, 0);









});

client.login(token);







