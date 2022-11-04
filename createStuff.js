const axios = require('axios');
const Database = require('better-sqlite3');

const db = new Database('./data/tokens.db', {verbose: console.log });

var tableName = "tokens";
var fields = "(currency TEXT, issuer TEXT)";
var sql = `CREATE TABLE IF NOT EXISTS ${tableName} ${fields}`;
const createTable = db.prepare(sql);
createTable.run();

/*
axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
    //console.log(res.data.tokens);
    let count = 0;
    let id = 0;
    const insert = db.prepare('INSERT INTO tokens (currency, issuer) VALUES (@currency, @issuer)');
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
*/
const stmt = db.prepare("SELECT * FROM tokens");
var results = stmt.all();
console.log(results);

/*
async function getTokens() {
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
        //console.log(res.data);
        //console.log(res.data.tokens);
        //console.log(res.data.tokens[0].currency);
        //console.log(res.data.tokens[0].issuer);

        let count = 0;
        let id = 0;
        let sql = db.prepare('INSERT INTO tokens (id, currency, issuer) VALUES (@id, @currency, @issuer)');
        let insertMany = db.transaction((want) => {
            for (const need of want) insertMany.run(need);
        });
        //const theTokens = res.data.tokens.forEach((element) => {
        //    count++;
        //    id++;
            
            
        

            //console.log(sql);
            //var params = [id, element.currency, element.issuer];
            //db.prepare(sql, params).run();
            //const stmt7 = db.prepare("SELECT * FROM tokens");
            //var results = stmt7.all();
            //console.log(results);
            //console.log(params);
            //db.prepare(sql, params, function(err) {
                //const stmt6 = db.prepare("SELECT * FROM tokens");
                //var results = stmt6.all();
                //console.log(results);
            //    if (err) {
            //        console.log("Error when adding token: ", err.message);
            //    }
                //console.log(`inserted: ${this.lastID}`);
            //    console.log(`${id},${element.currency},${element.issuer}`);
            //});
            //console.log(element.currency + " and " + element.issuer);
            //count++;
        })
        //console.log(count);
        //let length = allTokens.length;
        //console.log(length);

    //});
}

async function getMoreTokens() {
    //console.log("Time to get more tokens");
    let jojo = db.prepare"SELECT * FROM tokens";
    db.prepare(sql);
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
            createTables();
            getTokens();
        }
    } catch(err) {
        console.log("some error", err);
    }
};

allTokens();

*/