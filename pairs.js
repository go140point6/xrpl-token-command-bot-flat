const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./data/tokens.db', (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
    } else if (err) {
        console.log("Getting error " + err);
        exit(1);
    }
    getPairs();
});

function createDatabase() {
    var newdb = new sqlite3.Database('./data/tokens.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

function createTables(newdb) {
    newdb.exec(`
        create table tokens (
            issuer int primary key not null,
            currency text not null
        );
    `, () => {
        getPairs();
    });
}

async function getPairs() {
    //await axios.get(`https://api.onthedex.live/public/v1/daily/tokens?by=trades`).then(res => {
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
        //console.log(res.data);
        //console.log(res.data.tokens);
        //console.log(res.data.tokens[0].currency);
        let count = 0;
        const allTokens = res.data.tokens.forEach((element) => {
            console.log(element.currency + " and " + element.issuer);
            count++;
        })
        console.log(count);
        //let length = allTokens.length;
        //console.log(length);
    });
}

//getPairs();


//console.log(tokens.length);

        //this.data = res.data;
        //let test = Array.isArray(this.data);
        //console.log(test);
        //console.log(this.data);

        //Array.from(res).forEach(item => console.log(item));
        
/*         data.forEach((pair) => {
            console.log(pair)
            console.log(pair.currency);
            console.log(pair.issuer);
        });
*/        //})
//};