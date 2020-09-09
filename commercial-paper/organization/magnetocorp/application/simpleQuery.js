const axios = require('axios');

let stockCode='ANZ';
let askPrice=42.00;
let priceFilter = {"$gt":askPrice.toString()}

// Make a request for a user with a given ID
axios.post('http://192.168.171.216:5984/mychannel_papercontract/_find',{
  "selector":{
    "stockCode":stockCode,
    "class":"org.deasx.tradeOrder",
    "buyOrSell": "Buy",
    "price": priceFilter,
    "currentState":{
      "$or":[1,2]
    }
  },
  "fields":[
      "id",
      "class",
      "stockCode",
      "buyOrSell",
      "price",
      "unit",
      "unitOnMarket",
      "currentState"
  ],
  "sort": [{"price": "desc"}],
  "limit":50

})
  .then(function (response) {
    // handle success
    let result = response.data.docs.map(d=>{
            return {
                issuer : d.issuer,
                faceValue : d.faceValue
            };
    });
    console.log(response.data.docs);
    console.log(result);
  })
  .catch(function (error) {
    // handle error
    //console.log(error);
  })
  .then(function () {
    // always executed
  }); 

