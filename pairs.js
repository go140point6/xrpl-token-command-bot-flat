const axios = require('axios');

async function getPairs() {
    await axios.get(`https://api.onthedex.live/public/v1/daily/tokens`).then(res => {
        forEach(currency => console.log(res.currency))
        })
}

getPairs();