const axios = require('axios');

const queryOrder = async (parent, args) => {
    console.log(args);
    // console.log('stockCode:' + stockCode);
    // console.log('buyOrSell:' + buyOrSell);

    try {
        const response = await axios.post('http://172.17.166.244:5984/mychannel_deasxcontract/_find', {
            "selector": {
                "stockCode": args.stockCode,
                "class": "org.deasx.tradeOrder",
                "buyOrSell": args.buyOrSell,
                "currentState": {
                    "$or": [1, 2]
                }
            },
            "fields": [
                "id",
                "stockCode",
                "buyOrSell",
                "price",
                "unitOnMarket"
            ],
            "sort": [{ "price": "desc" }],
            "limit": 50
        });

        return response.data.docs.map(d => {
            return {
                id: d.id,
                stockCode: d.stockCode,
                buyOrSell: d.buyOrSell,
                price: parseFloat(d.price),
                unitOnMarket: parseInt(d.unitOnMarket)
            }
        });

    }
    catch (error) {
        // handle error
        console.log(error);
    };
};

module.exports = queryOrder;
