import React, { Fragment } from 'react';
import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, gql, useMutation } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://172.17.166.248:4000/graphql',
  cache: new InMemoryCache()
});


const QUERY_TRANSACTION = gql`
query {
  queryTransaction {
    stockCode
    buyer
    seller
    price
    unit
    tradeTime
    currentState
    creator
  }
}
`;

function TransactionItem(props) {
  return (
    <Fragment>
    {
        <div style={{display:'flex', width:'700px'}}>
          <div style={{width:'10%'}}>{props.txn.stockCode}</div>
          <div style={{width:'20%'}}>{props.txn.buyer}</div>
          <div style={{width:'20%'}}>{props.txn.seller}</div>
          <div style={{width:'10%'}}>{props.txn.price}</div>
          <div style={{width:'10%'}}>{props.txn.unit}</div>
          <div style={{width:'30%'}}>{props.txn.tradeTime}</div>
        </div>                
    }
    </Fragment>
  )
}


function QueryTransaction() {
  const { loading, error, data } = useQuery(QUERY_TRANSACTION);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div class="section-4">
    <div>
      <h4 class="heading-3">Recent transactions</h4>
    </div>
    <ul role="list" class="list">
      {
        data.queryTransaction.slice(0,8).map(txn => (
          <li class="list-item">
            <TransactionItem txn={txn}></TransactionItem>
          </li>
        ))
      }
    </ul>
  </div>)
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <div name="AllanApp">
            <QueryTransaction></QueryTransaction>
          </div>
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
