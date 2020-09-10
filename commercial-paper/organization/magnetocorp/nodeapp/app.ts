'use strict'
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema, addSchemaLevelResolveFunction } from 'apollo-server';
import { merge } from 'lodash';

import * as GenericTypes from "./src/graphqltypes/GenericGqlTypes";
import { HeartBeatGqlResolvers, HeartBeatGqlSchema } from './src/HeartBeatGql/HeartBeatGql';
import { TraderGqlResolvers, TraderGqlSchema } from './src/TraderGql/TraderGql';
//import { HomePageGqlResolvers, HomePageGqlSchema } from './src/PageGql/HomePageGql';
import { HomePage_Actions } from './src/graphqltypes/PageActionGqlTypes';



const app = express();
app.use(cors());

const Query = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;
const resolvers = {};

const forgedSchema = makeExecutableSchema({
    typeDefs: [ Query, 
      HeartBeatGqlSchema, 
      TraderGqlSchema, 
 //     HomePageGqlSchema, 
      GenericTypes.HeartBeat, 
      GenericTypes.Token,
      GenericTypes.Order,
      HomePage_Actions,
    ],

    resolvers: merge(resolvers, 
      HeartBeatGqlResolvers, 
      TraderGqlResolvers
  //    HomePageGqlResolvers,
      )

  });


const rootResolveFunction = (parent:any, args:any, context:any, info:any) => {
  const token = context.authorization || '';

  // try to retrieve a user with the token
  const user = token.userId;

  console.log('allan test token:' + JSON.stringify(token));

  // add the user to the context
  return { user };
};

addSchemaLevelResolveFunction(forgedSchema, rootResolveFunction)

const server = new ApolloServer({schema: forgedSchema});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});