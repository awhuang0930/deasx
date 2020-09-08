const axios = require('axios');

// Make a request for a user with a given ID
axios.post('http://192.168.171.217:5984/mychannel_papercontract/_find',{
    "selector":{
        "faceValue":{
            "$gt":"4000000"
        }
    }
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

