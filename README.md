# Discord League of Legends ARAM MMR Automatic Game Posting Bot
A node.js discord bot that will monitor when summoners join an ARAM game in League of Legends. When it finds a game, it will grab live game data from RIOT API and WhatIsMyMMR.com and post this data into a discord channel as an image

## Assumptions: 
You are able to run a node.js application with your enviornment and you are familiar with the Discord bot ecosystem

## Installation:
db.js:
- Import structure.sql into MySQL
- Update db.js with your mysql credentials

config.js
- Obtain a RIOT API key and update LOL_API_KEY
- Obtain a Discord App API key and update token
- Set your Discord Channel id as channelId
- Rename default-config.js to config.js

Install the dependencies and devDependencies and start the server.
```sh
npm i
```
Run the app
```sh
node index.js
```

Within MySQL, foreach summoner you wish to monitor:
- Manually add a new row in table discord_summoners
- Set LOL_summonerName to the Summoner you wish to monitor
- Set monitorYN to 1

## Other Information
- Images that are created are saved in the html_to_images directory