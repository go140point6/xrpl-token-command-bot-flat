const axios = require('axios');

async function getPairs() {
    //await axios.get(`https://api.onthedex.live/public/v1/daily/tokens`).then(res => {
    let responseJson = await axios.get(`https://api.onthedex.live/public/v1/daily/tokens`)
    return responseJson;
    console.log(responseJson);
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
};

getPairs();