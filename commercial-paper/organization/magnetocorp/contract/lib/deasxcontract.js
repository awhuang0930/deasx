/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// DeAsx specifc classes
const TradeOrder = require('./order.js');
const TradeOrderList = require('./orderlist.js');
const Transaction = require('./transaction.js');
const TransactionList = require('./transactionlist.js');

/**
 * A custom context provides easy access to list of all tradeOrder and transactions
 */
class DeAsxContext extends Context {
    constructor() {
        super();
        // All orders are held in a list of trade orders
        this.tradeOrderList = new TradeOrderList(this);
        this.transactionList = new TransactionList(this);
    }
}

/**
 * Define deasx smart contract by extending Fabric Contract class
 *
 */
class DeAsxContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.deasx');
    }

    /**
     * Define a custom context for deasx trading
    */
    createContext() {
        return new DeAsxContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Place order
    */
    async placeOrder(ctx, broker, stockCode, unit, price, buyOrSell) {
        // create an instance of the order
        let order = TradeOrder.createInstance(broker, stockCode, unit, unit, price, buyOrSell);

        // Smart contract, rather than order, moves order into PlACED state
        order.setPlaced();

        // Add the order to the list of all similar commercial order in the ledger world state
        await ctx.tradeOrderList.addOrder(order);

        // Must return a serialized order to caller of smart contract
        return order;
    }

    async transact(ctx, buyOrderId, sellOrderId, triggeredBy){
        // Todo1 : In the appliation JS,
        //  after place an order
        // 1. lock this order
        // 2. Get the list of protential matching orders
        // 3. tranaction against to the matching orders
        // 4. after the potential transaction completed, if the Unit still remained 
        //    unlock the order and leave it on the market

        // Todo2: Here
        // 1. check the lock status of counterpart order
        // 2. if it is still unlock, lock it. and create a new transaction.
        // 2.1 Update the 2 order accordingly.
        // 2.2 unlock the order need to be back to market again.
        // 3. if the counterparty order is locked, bypass this order.

        let sellOrderKey = TradeOrder.makeKey(['Order', sellOrderId]);
        let sellOrder = await ctx.tradeOrderList.getOrder(sellOrderKey);

        let buyOrderKey = TradeOrder.makeKey(['Order', buyOrderId]);
        let buyOrder = await ctx.tradeOrderList.getOrder(buyOrderKey);

        if ( sellOrder.isFilled() || buyOrder.isFilled()){
            return 'No trade made';
        }

        let tradePrice = (triggeredBy === "Seller" ) ? buyOrder.price : sellOrder.price;
        let tradeUnit = parseInt(Math.min(buyOrder.unitOnMarket, sellOrder.unitOnMarket));

        if ( buyOrder.unitOnMarket > sellOrder.unitOnMarket){
            buyOrder.setPartialFilled();
            sellOrder.setFilled();
            let unitOnMarket = parseInt(buyOrder.unitOnMarket);
            unitOnMarket = unitOnMarket - tradeUnit;
            buyOrder.setUnitOnMarket(unitOnMarket.toString());
            sellOrder.setUnitOnMarket('0');
        }else if (buyOrder.unitOnMarket === sellOrder.unitOnMarket){
            buyOrder.setFilled();
            sellOrder.setFilled();
            buyOrder.setUnitOnMarket('0');
            sellOrder.setUnitOnMarket('0');
        }else{ // buyOrder.unitOnMarket < sellOrder.unitOnMarket
            sellOrder.setPartialFilled();
            buyOrder.setFilled();
            let unitOnMarket = parseInt(sellOrder.unitOnMarket);
            unitOnMarket = unitOnMarket - tradeUnit;
            sellOrder.setUnitOnMarket(unitOnMarket.toString());
            buyOrder.setUnitOnMarket('0');
        }
        await ctx.tradeOrderList.updateOrder(sellOrder);
        await ctx.tradeOrderList.updateOrder(buyOrder);

        let transaction = Transaction.createInstance(buyOrder.stockCode, tradeUnit, tradePrice, buyOrder.broker, sellOrder.broker);
        await ctx.transactionList.addTransaction(transaction);
        return transaction;
    }

    /**
     * Cancel order
     *
    */
    async cancelOrder(ctx, orderId) {
    }
}

module.exports = DeAsxContract;
