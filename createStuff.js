const axios = require('axios');
const Database = require('better-sqlite3');
const sqlite3 = require('sqlite3');
const fs = require('fs')

const path = './data/tokens.db';
const tableName = "tokens";

let db = new sqlite3.Database('./data/tokens.db', (err) => {
    console.log("createDatabase");
    createDatabase();
});

function createDatabase() {
    var newdb = new sqlite3.Database('./data/tokens.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        console.log("createTables");
        createTables(newdb);
    });
}

function createTables(newdb) {
    newdb.exec(`
        create table if not exists tokens (
            id int primary key not null,
            currency text not null,
            issuer text not null
        );
    `, () => {
        console.log("DB and Table created");
        console.log("getTokens");
        getTokens();
    });
}

async function getTokens() {
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
        //console.log(res.data);
        //console.log(res.data.tokens);
        //console.log(res.data.tokens[0].currency);
        let count = 0;
        let id = 0;
        const theTokens = res.data.tokens.forEach((element) => {
            count++;
            id++;
            let sql = "INSERT INTO tokens(id,issuer,currency) VALUES(?,?,?)";
            //console.log(sql);
            var params = [id, element.currency, element.issuer];
            //console.log(params);
            db.run(sql, params, function(err) {
                const stmt6 = db.prepare("SELECT * FROM tokens");
                var results = stmt6.all();
                console.log(results);
                if (err) {
                    console.log("Error when adding token: ", err.message);
                }
                //console.log(`inserted: ${this.lastID}`);
                console.log(`${id},${element.currency},${element.issuer}`);
            });
            //console.log(element.currency + " and " + element.issuer);
            //count++;
        })
        console.log(count);
        //let length = allTokens.length;
        //console.log(length);
    });
}

async function getMoreTokens() {
    console.log("Time to get more tokens");
}

async function allTokens() {
    try {
        if (fs.existsSync(path)) {
            console.log("db exists, so getMoreTokens");
            db = new Database('./data/tokens.db');
            await getMoreTokens()
        } 
    } catch(err) {
        console.log("some error", err);
    }
};

allTokens();

