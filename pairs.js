const axios = require('axios');

function getPairs() {
    return axios.get(`https://api.onthedex.live/public/v1/daily/tokens`).then(res => {
        return res;
    })
}

var item = [];
var response = getPairs().then(function (res) {
    item.push(res.data[1]);
});

console.log(item);

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