/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const CommercialPaper = require('./paper.js');

class PaperList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.commercialpaperlist');
        this.use(CommercialPaper);
    }

    async addPaper(paper) {
        return this.addState(paper);
    }

    async getPaper(paperKey) {
        return this.getState(paperKey);
    }

    async queryAllPaper(startKey, endKey) {
        // const startKey = '00000';
        // const endKey = '99999';
        return this.queryAllState(startKey, endKey);
    }

    async queryState(query) {
        // const startKey = '00000';
        // const endKey = '99999';
        return this.queryState(query);
    }

    async updatePaper(paper) {
        return this.updateState(paper);
    }
}


module.exports = PaperList;