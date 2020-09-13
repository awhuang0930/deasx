import React, { Fragment } from 'react';
import './webflow.css';
import './deasxui.css';
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

const MUTATION_PLACEORDER = gql`
mutation DeAsx($stockCode:String!, $buyOrSell:String!, $price:Float!, $unit:Int!){
  placeOrder(stockCode:$stockCode, buyOrSell:$buyOrSell, price:$price, unit:$unit)
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
    <ul class="list">
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

// function PlaceOrderOnClick(){
//   const [placeOrder, { loading, error, data }] = useMutation(MUTATION_PLACEORDER,
//     {
//       variables:{}
//     });

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;
// }

function PlaceOrderForm(){
  const [stockCode, setStockCode] = React.useState("");
  const [buyOrSell, setBuyOrSell] = React.useState("");
  const [price, setPrice] = React.useState(0.00);
  const [unit, setUnit] = React.useState(0);
  const [placeOrder] = useMutation(MUTATION_PLACEORDER);
  let input = {};

  return (
    <div class="w-form">
    <form id="email-form" name="email-form" data-name="Email Form"
        onSubmit={ e=> {
          e.preventDefault();
          console.log(input);
          placeOrder({variables:{
            "stockCode": stockCode,
            "buyOrSell": buyOrSell,
            "price": price,
            "unit": unit
          }});

        }}
    >
      <div class="columns-2 w-row">
        <div class="w-col w-col-6">
          <label for="StockCode-2" class="uiform-label">Stock Code</label>
          <select id="StockCode-2" name="StockCode" required="" onChange={e =>setStockCode(e.target.value)} class="select-field w-select">
            <option value="ANZ">ANZ</option>
            <option value="CBA">CBA</option>
          </select>
          <label for="Price" class="uiform-label">Price</label>
          <input type="money" class="text-field w-input" maxlength="256" name="Price" onChange={e =>setPrice(parseFloat(e.target.value))} id="Price" required="">            
          </input>
        </div>
        <div class="w-col w-col-6">
          <label for="BuyOrSell-3" class="uiform-label">Buy or sell</label>
          <select id="BuyOrSell-3" name="BuyOrSell-3" onChange={e =>setBuyOrSell(e.target.value)}  required="" class="select-field w-select">
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
          <label for="Unit" class="uiform-label">Number of unit</label>
          <input type="number" class="text-field-2 w-input" maxlength="256" name="Unit" onChange={e =>setUnit(parseInt(e.target.value))}  placeholder="Example Text" id="Unit" required="">
          </input>
        </div>
      </div>
      <input type="submit" value="Place Order" data-wait="Please wait..." class="submit-button w-button">
      </input>
    </form>
  </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <div name="AllanApp">
            <QueryTransaction></QueryTransaction>
            <PlaceOrderForm></PlaceOrderForm>
          </div>
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
