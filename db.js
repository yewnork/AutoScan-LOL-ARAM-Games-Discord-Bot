import { createConnection } from 'mysql';
import util from 'util';

var con = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "discord_aram"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Database!");
});

export {con, util};
