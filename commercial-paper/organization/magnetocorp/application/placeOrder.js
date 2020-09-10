/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios');
const { FileSystemWallet, Gateway } = require('fabric-network');
const TradeOrder = require('../contract/lib/order.js');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('../identity/user/isabella/wallet');

// Main program function
async function main(buyOrSell, stockCode, price, orderUnit) {
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
            discovery: { enabled:false, asLocalhost: true }
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
        const orderResponse = await contract.submitTransaction('placeOrder','YvonneCorp',stockCode, orderUnit, price, buyOrSell);
        // process response
        console.log('Process place order response:  ' + orderResponse);
        if (typeof orderResponse === 'object' && orderResponse !== null){
            //orderId = orderResponse.id;
            let orderObj = JSON.parse(orderResponse);
            return orderObj;
        }else{
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
async function transactOnMarket(buyOrderId, sellOrderId) {
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
            discovery: { enabled:false, asLocalhost: true }
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
        //  after place an order
        // 1. Get the list of protential matching orders
        // 2. tranaction against to the list matching orders
        // 3. after the potential transaction completed, if the Unit still remained 
        //    unlock the order and leave it on the market
        const txnResponse = await contract.submitTransaction('transact', buyOrderId, sellOrderId);          
        return txnResponse;

        //let paper = TradeOrder.fromBuffer(issueResponse);

        //console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully issued for value ${paper.faceValue}`);
        //console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}

function getProposeMatchingOrders(stockCode, priceFilter, buyOrSell) {
	console.log('stockCode:' + stockCode);
	console.log(priceFilter);
	console.log('buyOrSell:' + buyOrSell);

    await axios.post('http://172.17.166.247:5984/mychannel_deasxcontract/_find', {
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
    })
    .then(function (response) {
        // handle success
        let result = response.data.docs.map(d=>{
                return {
                    id : d.id,
                    unitOnMarket : d.unitOnMarket
                };
        });
        //console.log(response.data.docs);
        //console.log(result);
        return result;
    })
    .catch(function (error) {
    // handle error
    //console.log(error);
    })
    .then(function () {
    // always executed
    }); 
};


main('Sell', 'ANZ', '52.10', '88').then((orderObj) => {
    console.log('Place order complete.');

    let priceFilter = orderObj.buyOrSell === 'Sell' ? { "$gte": orderObj.price.toString() } : { "$lte": orderObj.price.toString() };
    let matchingBuyOrSell = orderObj.buyOrSell === 'Sell' ? 'Buy' : 'Sell';
    const ordersToMatch = getProposeMatchingOrders(orderObj.stockCode, priceFilter, matchingBuyOrSell);
    console.log(ordersToMatch);

    ordersToMatch.forEach( async o => {
        let sellOrderId = orderObj.buyOrSell === 'Sell' ? orderObj.id : o.id;
        let buyOrderId = orderObj.buyOrSell === 'Buy' ?  orderObj.id : o.id;
        console.log("Start matching order");
        console.log(`Buy order id: ${buyOrderId}`);
        console.log(`Sell order id:${sellOrderId}`);
        const txnResponse = transactOnMarket(buyOrderId, sellOrderId).then(() => {
            console.log("Process transact on market resposnse: " + txnResponse);
        }).catch( (e) => {
            console.log("Transaction on Market error.")
        })       
    })
}).catch((e) => {
    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});
