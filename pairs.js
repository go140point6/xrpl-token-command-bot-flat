const axios = require('axios');

async function getPairs() {
    await axios.get(`https://api.onthedex.live/public/v1/daily/tokens`).then(res => {
        let currency = res.data.token.currency;
        let issuer = res.data.token.issuer;
        console.log(currency + "." + issuer);
    })
}

getPairs();