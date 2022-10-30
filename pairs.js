const axios = require('axios');

async function getPairs() {
    await axios.get(`https://api.onthedex.live/public/v1/daily/tokens`).then(res => {
        this.data = res.data;
        console.log(this.data);
        let n = 1;
        forEach(this.data) {
            const m = n++
        }
        console.log(n);
        console.log(m);
/*         data.forEach((pair) => {
            console.log(pair)
            console.log(pair.currency);
            console.log(pair.issuer);
        });
*/        })
};

getPairs();