const axios = require('axios');

var allTokens;

async function getPairs() {
    //await axios.get(`https://api.onthedex.live/public/v1/daily/tokens?by=trades`).then(res => {
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
        console.log(res.data);
        //console.log(res.data.tokens);
        //console.log(res.data.tokens[0].currency);
        //allTokens = res.data.tokens.forEach((element) => {
            //console.log(element.currency + " and " + element.issuer);
        //})
        //let length = allTokens.length;
        //console.log(length);
    });
}

getPairs();

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