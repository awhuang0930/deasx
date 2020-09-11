/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Transaction = require('./transaction.js');

class TransactionList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.deasx.transactionlist');
        this.use(Transaction);
    }

    async addTransaction(transaction) {
        return this.addState(transaction);
    }

    async getTransaction(transactionKey) {
        return this.getState(transactionKey);
    }
}

module.exports = TransactionList;