const axios = require('axios');
const Database = require('better-sqlite3');

const db = new Database('./data/tokens.db', {verbose: console.log });

var tableName = "tokens";
var fields = "(id INTEGER PRIMARY KEY AUTOINCREMENT, currency TEXT, issuer TEXT)";
var sql = `CREATE TABLE IF NOT EXISTS ${tableName} ${fields}`;
const createTable = db.prepare(sql);
createTable.run();

async function getTokens() {
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
        //console.log(res.data.tokens);
        let count = 0;
        let id = null;
        const insert = db.prepare(`INSERT INTO tokens (id, currency, issuer) VALUES (${id}, @currency, @issuer)`);
        //var insertQuery = "INSERT INTO tokens VALUES (?,?,?)";

        const insertMany = db.transaction((tokens) => {
            for (const token of tokens) insert.run(token)
        })

        insertMany(res.data.tokens);
        
        //db.prepare(insertQuery).run(id, currency, issuer);
        
        //const stmt = db.prepare("SELECT * FROM tokens");
        //var results = stmt.all();
        //console.log(results);

    });
};

async function grabTokens() {
    await getTokens();
    const stmt = db.prepare("SELECT * FROM tokens");
    //const stmt2 = db.prepare("SELECT EXISTS (SELECT name FROM sqlite_schema WHERE type='table' AND name='tokens')");
    //var results = stmt2.get();
    var results = stmt.all();
    //console.log(Object.values(results));
    //const isZero = results.every(item => item === 0)
}

grabTokens();