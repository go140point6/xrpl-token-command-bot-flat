const tableName = "tokens";
const db = new Database('./data/tokens.db');
createTable();
getTokens();
//getMoreTokens();

function createTable() {
    let fields = "(id INT PRIMARY KEY NOT NULL, currency TEXT, issuer TEXT)";
    let sql = `CREATE TABLE IF NOT EXISTS  ${tableName} ${fields}`;
    let makeTable = db.prepare(sql);
    makeTable.run();
};

async function getTokens() {
    let sql = `SELECT EXISTS (SELECT 1 FROM ${tableName})`;
    console.log(sql);
    let grabTokens = db.prepare(sql);
    grabTokens.run();
    console.log(grabTokens);

    /*
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
        //console.log(res.data);
        //console.log(res.data.tokens);
        //console.log(res.data.tokens[0].currency);
        let count = 0;
        let id = 0;
        const allTokens = res.data.tokens.forEach((element) => {
            count++;
            id++;
            var sql = "INSERT INTO tokens(id,issuer,currency) VALUES(?,?,?)";
            //console.log(sql);
            var params = [id, element.issuer, element.currency];
            //console.log(params);
            db.run(sql, params, function(err) {
                //console.log(element.issuer);
                if (err) {
                    console.log("Error when adding token: ", err.message);
                }
                //console.log(`inserted: ${this.lastID}`);
                console.log(`${id},${element.issuer},${element.currency}`);
            });
            //console.log(element.currency + " and " + element.issuer);
            //count++;
        })
        console.log(count);
        //let length = allTokens.length;
        //console.log(length);
    });*/
}
