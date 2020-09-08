/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const TradeOrder = require('./order.js');
const TradeOrderList = require('./orderlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class DeAsxContext extends Context {

    constructor() {
        super();
        // All orders are held in a list of trade orders
        this.tradeOrderList = new TradeOrderList(this);
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
    async placeOrder(ctx, broker, stockCode, unit, price) {

        // create an instance of the order
        let order = TradeOrder.createInstance(broker, stockCode, unit, price);

        // Smart contract, rather than order, moves order into PlACED state
        order.setPlaced();

        // Add the order to the list of all similar commercial order in the ledger world state
        await ctx.tradeOrderList.addOrder(order);

        // Must return a serialized order to caller of smart contract
        return order;
    }

    /**
     * Cancel order
     *
    */
    async cancelOrder(ctx, orderId) {
    }
}

module.exports = DeAsxContract;
