const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs.js');
const marketQuery = require('./rsvMarketQuery.js');
const placeOrder = require('./rsvPlaceOrder.js');
const queryTransaction = require('./rsvTransactionQuery.js');


  // Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      orders: marketQuery,
      queryTransaction : queryTransaction
    },
    Mutation: {
      placeOrder: placeOrder
    }
  };

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen({port: 4001}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
