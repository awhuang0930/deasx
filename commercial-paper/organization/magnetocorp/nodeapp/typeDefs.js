// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const { gql } = require('apollo-server');
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Order {
      id: String!
      stockCode: String!
      buyOrSell: String!
      price: Float!
      unitOnMarket: Int!
  }

  type AskBidItem {
    key: Int!
    price: Float!
    unitOnMarket: Int!   
  }

  type MarketDepth {
    askList: [AskBidItem],
    bidList: [AskBidItem]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    orders(stockCode:String!) : MarketDepth
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Mutation {
    placeOrder(stockCode:String!, buyOrSell:String!) : Int!
  }
`;

module.exports = typeDefs
