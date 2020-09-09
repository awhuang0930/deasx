/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Transaction extends State {

    constructor(obj) {
        super(Transaction.getClass(), ['Transaction', obj.id]);
        Object.assign(this, obj);
    }

    static fromBuffer(buffer) {
        return Transaction.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Transaction);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(stockCode, unit, price, buyer, seller) {
        let id = TradeOrder.createGuid();
        let tradeTime = TradeOrder.formatDatetime(new Date());
        return new Transaction({ id, stockCode, unit, price, buyer, seller,tradeTime });
    }

    static getClass() {
        return 'org.deasx.transaction';
    }
}

module.exports = Transaction;
