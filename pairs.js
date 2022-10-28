const axios = require('axios');

async function getPairs() {
    await axios.get(`https://api.onthedex.live/public/v1/daily/tokens`).then(res => {
        console.log(res.data.tokens.currency+"."+res.data.tokens.issuer);
    })
}

getPairs();