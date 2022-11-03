const axios = require('axios');
const Database = require('better-sqlite3');
const fs = require('fs')

const path = './data/tokens.db';
//const db = new Database('./data/tokens.db');
const tableName = "tokens";
let db;

function createTable() {
    let fields = "(currency TEXT, issuer TEXT)";
    let sql = `CREATE TABLE IF NOT EXISTS ${tableName} ${fields}`;
    let makeTable = db.prepare(sql);
    makeTable.run();
};

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
            let sql = "INSERT INTO tokens(id,currency,issuer) VALUES(?,?,?)";
            //console.log(sql);
            var params = [id, element.currency, element.issuer];
            //console.log(params);
            db.prepare(sql, params, function(err) {
                //console.log(element.issuer);
                if (err) {
                    console.log("Error when adding token: ", err.message);
                }
                console.log(`inserted: ${this.lastID}`);
                console.log(`${id},${element.currency},${element.issuer}`);
            });
            console.log(element.currency + " and " + element.issuer);
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
        } else {
            console.log("db doesn't exist, so create it, the table and get initial token list");
            db = new Database('./data/tokens.db');
            createTable();
            getTokens();
        }
    } catch(err) {
        console.log("some error", err);
    }
};

allTokens();