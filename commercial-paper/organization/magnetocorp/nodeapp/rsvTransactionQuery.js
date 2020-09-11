const axios = require('axios');

const queryTransaction = async (parent, args) => {
    console.log(args);

    try {
        //const response = await axios.post('http://172.17.166.244:5984/mychannel_deasxcontract/_find', {
        const response = await axios.post('http://localhost:5984/mychannel_deasxcontract/_find', {
            "selector":{
                "class":"org.deasx.transaction"
            },
            "fields":[
                "stockCode",
                "buyer",
                "seller",
                "price",
                "unit",
                "tradeTime",
                "currentState",
                "creator"
            ],
            "sort": [{"tradeTime": "desc"}],
            "limit":30
        });

        //console.log(response.data.docs);
        return response.data.docs.map(m => {
            return {
                stockCode : m.stockCode,
                buyer : m.buyer,
                seller : m.seller,
                price : parseFloat(m.price),
                unit : parseInt(m.unit),
                tradeTime : m.tradeTime,
                currentState : parseInt(m.currentState),
                creator : m.creator
            }
        });
    }
    catch (error) {
        // handle error
        console.log(error);
    };
};

module.exports = queryTransaction;
