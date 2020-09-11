/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const TradeOrder = require('./order.js');

class TradeOrderList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.deasx.tradeOrderlist');
        this.use(TradeOrder);
    }

    async addOrder(order) {
        return this.addState(order);
    }

    async getOrder(orderKey) {
        return this.getState(orderKey);
    }

    async updateOrder(order) {
        return this.updateState(order);
    }
}

module.exports = TradeOrderList;