'use strict'
//import { RestClient } from '../RestClient';
import { PromiseRestClient } from '../PromiseRestClient';


export const TraderGqlSchema = `
    extend type Query {
        queryQuote(stockCode:String!): Order
    }
`;


export const TraderGqlResolvers = {
    Query: {
      heartbeatget: async (root:any, args:any) => {
        const heartbeatRestUri = args.uri;
        console.log("GET: uri is:"+heartbeatRestUri);
        let entity = await PromiseRestClient.Get(heartbeatRestUri+"(2)");
        console.log(entity);
        return entity; 
      },
      queryQuote: async (root:any, args:any) => {
        const stockCode = args.stockCode;
        
        const richQuery = 
        {
          "selector":{
              "stockCode":stockCode,
              "class":"org.deasx.tradeOrder",
              "currentState":{
                  "$or":[1,2,3]
              }
          },
          "fields":[
              "key",
              "class",
              "stockCode",
              "buyOrSell",
              "price",
              "unit",
              "unitOnMarket",
              "currentState"
          ],
          "sort": [{"price": "desc"}],
          "limit":10
        };
        console.log("GET: stockCode is:"+stockCode);
        let entity = await PromiseRestClient.Post('http://localhost:5984/mychannel_deasxcontract/_find', richQuery);
        console.log(entity);
        return entity; 
      },
    },
  };


  // Test Case

  // mutation {
  //   heartbeatadd(uri:"http://10.0.0.225:30430"){
  //     id,
  //     logLevelId,
  //     shortMessage,
  //     fullMessage
  //   }
  // }
