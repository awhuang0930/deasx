const axios = require('axios');

const aggregateListByKey = (askBidList) => {
    let aggregatedList = [];
    let current = null;
    for (const item of askBidList) {
        if ( current != null ){
           if(item.key != current.key){
                aggregatedList.push(current);
                current = null;
            }
        }
        current= { 
            key: item.key, 
            price: item.price, 
            unitOnMarket : (current||{unitOnMarket:0}).unitOnMarket + item.unitOnMarket
        };
    }
    aggregatedList.push(current);
    return aggregatedList;
}

const queryOrder = async (parent, args) => {
    console.log(args);
    // console.log('stockCode:' + stockCode);
    // console.log('buyOrSell:' + buyOrSell);

    try {
        const response = await axios.post('http://172.17.166.244:5984/mychannel_deasxcontract/_find', {
            "selector": {
                "stockCode": args.stockCode,
                "class": "org.deasx.tradeOrder",
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
            "sort": [{ "price": "asc" }],
            "limit": 50
        });

        const fetchedList = response.data.docs.map(d => {
            return {
                id: d.id,
                stockCode: d.stockCode,
                buyOrSell: d.buyOrSell,
                key: parseInt(d.price*10000),
                price: parseFloat(d.price),
                unitOnMarket: parseInt(d.unitOnMarket)
            }
        });

        const askList = fetchedList.filter( f => {
            return  f.buyOrSell === 'Sell';
        })
        .map( m => {
            return {
                key: m.key,
                price: m.price,
                unitOnMarket: m.unitOnMarket
            }
        });

        const bidList = fetchedList.filter( f => {
            return  f.buyOrSell === 'Buy';
        })
        .map( m => {
            return {
                key: m.key,
                price: m.price,
                unitOnMarket: m.unitOnMarket
            }
        }).reverse();

        return {
            askList : aggregateListByKey(askList),
            bidList : aggregateListByKey(bidList)
        }
    }
    catch (error) {
        // handle error
        console.log(error);
    };
};

module.exports = queryOrder;
