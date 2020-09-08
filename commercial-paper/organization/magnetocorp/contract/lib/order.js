/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate trade order state values
const orderState = {
    PLACED: 1,
    PARTIALFILLED: 2,
    FILLED: 3,
    CANCELLED: 4
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class TradeOrder extends State {

    constructor(obj) {
        super(TradeOrder.getClass(), ['Order', obj.Id]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    // getIssuer() {
    //     return this.issuer;
    // }

    // setIssuer(newIssuer) {
    //     this.issuer = newIssuer;
    // }

    // getOwner() {
    //     return this.owner;
    // }

    // setOwner(newOwner) {
    //     this.owner = newOwner;
    // }

    /**
     * Useful methods to encapsulate commercial paper states
     */

    setPlaced() {
        this.currentState = orderState.FILLED;
    }

    setPartialFilled() {
        this.currentState = orderState.PARTIALFILLED;
    }

    setFilled() {
        this.currentState = orderState.FILLED;
    }

    setCancelled() {
        this.currentState = orderState.CANCELLED;
    }

    isPartialFilled() {
        return this.currentState === orderState.PARTIALFILLED;
    }

    isFilled() {
        return this.currentState === orderState.FILLED;
    }

    isCancelled() {
        return this.currentState === orderState.CANCELLED;
    }

    static fromBuffer(buffer) {
        return TradeOrder.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, TradeOrder);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(id, stockCode, unit, price, buyOrSell) {
        return new TradeOrder({ id, stockCode, unit, price, buyOrSell });
    }

    static getClass() {
        return 'deasx.tradeOrder';
    }
}

module.exports = TradeOrder;
