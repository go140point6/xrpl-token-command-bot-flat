const axios = require('axios');

async function getPairs() {
    await axios.get(`https://api.onthedex.live/public/v1/daily/tokens`).then(res => {
        this.data = res.data;
        this.data.forEach((pair) => {
            console.log(pair)
            console.log(pair.currency);
            console.log(pair.issuer);
        });
        })
};

getPairs();