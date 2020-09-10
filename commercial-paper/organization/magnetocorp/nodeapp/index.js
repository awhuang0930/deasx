const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Order {
      id: String!
      stockCode: String!
      buyOrSell: String!
      price: Float!
      unitOnMarket: Int!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book],
    orders(stockCode:String!, buyOrSell:String!): [Order]
  }
`;

const queryOrder = async (parent, args) => {
    console.log(args);
    // console.log('stockCode:' + stockCode);
    // console.log('buyOrSell:' + buyOrSell);

    try {
        const response = await axios.post('http://172.17.166.247:5984/mychannel_deasxcontract/_find', {
            "selector": {
                "stockCode": args.stockCode,
                "class": "org.deasx.tradeOrder",
                "buyOrSell": args.buyOrSell,
                "currentState": {
                    "$or": [1, 2]
                }
            },
            "fields": [
                "id",
                "stockCode",
                "buyOrSell",
                "price",
                "unitOnMarket"
            ],
            "sort": [{ "price": "desc" }],
            "limit": 50
        });

        return response.data.docs.map(d => {
            return {
                id: d.id,
                stockCode: d.stockCode,
                buyOrSell: d.buyOrSell,
                price: parseFloat(d.price),
                unitOnMarket: parseInt(d.unitOnMarket)
            }
        });

    }
    catch (error) {
        // handle error
        console.log(error);
    };
};

const books = [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
    },
  ];

  // Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      books: () => books,
      orders: queryOrder
    },
  };

  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});