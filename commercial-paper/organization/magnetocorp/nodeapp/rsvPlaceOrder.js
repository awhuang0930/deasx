// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios');
const { FileSystemWallet, Gateway } = require('fabric-network');
const TradeOrder = require('../contract/lib/order.js');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('../identity/user/isabella/wallet');

const placeAOrder = async (buyOrSell, stockCode, price, orderUnit) => {
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
	const userName = 'User1@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: false, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.deasx smart contract.');

        const contract = await network.getContract('deasxcontract');

        // issue commercial paper
        console.log('Submit commercial paper issue transaction.');
        const orderResponse = await contract.submitTransaction('placeOrder', 'MegentoCorp', stockCode, orderUnit, price, buyOrSell);
        // process response
        console.log('Process place order response:  ' + orderResponse);
        if (typeof orderResponse === 'object' && orderResponse !== null) {
            //orderId = orderResponse.id;
            let orderObj = JSON.parse(orderResponse);
            return orderObj;
        } else {
            return null;
        }

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}

// Main program function
const transactOnMarket = async (buyOrderId, sellOrderId) => {
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'User1@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: false, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.deasx smart contract.');

        const contract = await network.getContract('deasxcontract');

        // issue commercial paper
        console.log('Submit transact transaction.');

        const txnResponse = await contract.submitTransaction('transact', buyOrderId, sellOrderId);
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
        return txnResponse;

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    };
}

const getProposeMatchingOrders = async (stockCode, priceFilter, buyOrSell) => {
    console.log('stockCode:' + stockCode);
    console.log(priceFilter);
    console.log('buyOrSell:' + buyOrSell);

    try {
        const response = await axios.post('http://localhost:5984/mychannel_deasxcontract/_find', {
            "selector": {
                "stockCode": stockCode,
                "class": "org.deasx.tradeOrder",
                "buyOrSell": buyOrSell,
                "price": priceFilter,
                "currentState": {
                    "$or": [1, 2]
                }
            },
            "fields": [
                "id",
                "unitOnMarket",
                "currentState"
            ],
            "sort": [{ "price": "desc" }],
            "limit": 50
        });

        return response.data.docs.map(d => {
            return {
                id: d.id,
                unitOnMarket: d.unitOnMarket
            }
        });

    }
    catch (error) {
        // handle error
        console.log(error);
    };
};

const placeOrder = async (parent, args) => {
    console.log(args);

    placeAOrder(args.buyOrSell, args.stockCode, args.price.toString(), args.unit.toString()).then(async (orderObj) => {
        console.log('Place order complete.');
        console.log(orderObj);

        //  after place an order
        // 1. Get the list of protential matching orders
        // 2. tranaction against to the list matching orders
        // 3. after the potential transaction completed, if the Unit still remained 

        let priceFilter = orderObj.buyOrSell === 'Sell' ? { "$gte": orderObj.price.toString() } : { "$lte": orderObj.price.toString() };
        let matchingBuyOrSell = orderObj.buyOrSell === 'Sell' ? 'Buy' : 'Sell';

        const matchedOrderList = await getProposeMatchingOrders(orderObj.stockCode, priceFilter, matchingBuyOrSell);
        console.log(matchedOrderList);
        for (const matchedOrder of matchedOrderList) {
            let sellOrderId = orderObj.buyOrSell === 'Sell' ? orderObj.id : matchedOrder.id;
            let buyOrderId = orderObj.buyOrSell === 'Buy' ? orderObj.id : matchedOrder.id;
            console.log("Start matching order");
            console.log(`Buy order id: ${buyOrderId}`);
            console.log(`Sell order id:${sellOrderId}`);
            const txnResponse = await transactOnMarket(buyOrderId, sellOrderId);
            console.log("Process transact on market resposnse: " + txnResponse);
        }
        console.log("Transact on existing orders on market completed.");
    });

    return 0;
};

module.exports = placeOrder;
