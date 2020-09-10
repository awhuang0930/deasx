'use strict'
//import { RestClient } from '../RestClient';
import { PromiseRestClient } from '../PromiseRestClient';


export const HeartBeatGqlSchema = `
    extend type Query {
        heartbeatget(uri:String!): HeartBeat
    }
    extend type Mutation {
        heartbeatadd(uri:String!): HeartBeat 
    }
`;

export const HeartBeatGqlResolvers = {
    Query: {
      heartbeatget: async (root:any, args:any) => {
        const heartbeatRestUri = args.uri;
        console.log("GET: uri is:"+heartbeatRestUri);
        let entity = await PromiseRestClient.Get(heartbeatRestUri+"(2)");
        console.log(entity);
        return entity; 
      }
    },
    Mutation: {
      heartbeatadd: async (root:any, args:any) => {
        const heartbeatRestUri = args.uri;
        console.log('allan test 001' + heartbeatRestUri);
        let rest = await PromiseRestClient.Get(heartbeatRestUri+"(2)");
        // console.log('allan test 002');
        // console.log(rest);

        let count:number = Number(rest.desc);
        let heartbeatCount:number = isNaN(count) ? 0 : count;
        rest.desc = String( heartbeatCount + 1 );
        console.log(`allan test 003, count is ${heartbeatCount}`);
  
        let postRes = await PromiseRestClient.Post(heartbeatRestUri, rest);
        console.log("HeartBeatAdd: Post status is " + JSON.stringify(postRes));
        return rest;
      }
    }
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
