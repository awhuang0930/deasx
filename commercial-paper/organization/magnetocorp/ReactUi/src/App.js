import React, { Fragment } from 'react';
import './webflow.css';
import './deasxui.css';
import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, gql, useMutation } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://172.17.166.243:4000/graphql',
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

const QUERY_MARKET = gql`
query DeAsx($stockCode:String!){
  orders(stockCode:$stockCode) {
		askList {
      key
      price
      unitOnMarket
    },
    bidList {
      key
      price
      unitOnMarket
    }
  }
}
`;

function AskOrBidItem(props) {
  return (
    <Fragment>
      {props.item &&
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ width: '30%' }}>{props.item.price}</div>
          <div style={{ width: '30%' }}></div>
          <div style={{ width: '30%' }}>{props.item.unitOnMarket}</div>
        </div>

      }
    </Fragment>
  );
}

function QueryMarketForAStock(props) {
  const { loading, error, data } = useQuery(QUERY_MARKET, {
    variables: {
      "stockCode": props.stockCode
    },
    pollInterval: 1000
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div class="div-block-2">
      <div >
        <h5>{props.stockCode}</h5>
      </div>
      <div class="columns-3 w-row">
        <div class="column w-col w-col-4">
          <h5 class="heading">Ask</h5>
        </div>
        <div class="column-2 w-col w-col-6">
          <h5>Bid</h5>
        </div>
      </div>

      <div class="columns-4 w-row">
        <div class="w-col w-col-6">
          <div style={{ display: 'flex', width: '100%', fontSize: '14px' }}>
            <div style={{ width: '30%' }}>Price</div>
            <div style={{ width: '30%' }}></div>
            <div style={{ width: '30%' }}>Unit</div>
          </div>
          {data.orders.askList.length >= 0 &&
            <ul class="list">
              {
                data.orders.askList.slice(0, 5).map(item => (
                  <li class="list-item">
                    <AskOrBidItem item={item}></AskOrBidItem>
                  </li>
                ))
              }
            </ul>
          }
        </div>
        <div class="w-col w-col-6">
          <div style={{ display: 'flex', width: '100%', fontSize: '14px' }}>
              <div style={{ width: '30%' }}>Price</div>
              <div style={{ width: '30%' }}></div>
              <div style={{ width: '30%' }}>Unit</div>
          </div>
          {data.orders.bidList.length >= 0 &&
            <ul class="list">             {
              data.orders.bidList.slice(0, 5).map(item => (
                <li class="list-item">
                  <AskOrBidItem item={item}></AskOrBidItem>
                </li>
              ))
            }
            </ul>
          }
        </div>
      </div>
    </div>
  );

}

function QueryMarket() {
  return (
    <Fragment>
      <div>
        <h4 class="heading-3">Market depth</h4>
      </div>
      <div class="columns w-row">
        <div class="w-col w-col-6">
          <QueryMarketForAStock stockCode='ANZ'></QueryMarketForAStock>
        </div>
        <div class="w-col w-col-6">
          <QueryMarketForAStock stockCode='CBA'></QueryMarketForAStock>
        </div>
      </div>
    </Fragment>
  )
}

function TransactionItem(props) {
  return (
    <Fragment>
      {
        props.txn &&
        <div style={{ display: 'flex', width: '700px' }}>
          <div style={{ width: '10%' }}>{props.txn.stockCode}</div>
          <div style={{ width: '20%' }}>{props.txn.buyer}</div>
          <div style={{ width: '20%' }}>{props.txn.seller}</div>
          <div style={{ width: '10%' }}>{props.txn.price}</div>
          <div style={{ width: '10%' }}>{props.txn.unit}</div>
          <div style={{ width: '30%' }}>{props.txn.tradeTime}</div>
        </div>
      }
    </Fragment>
  )
}

function QueryTransaction() {
  const { loading, error, data } = useQuery(QUERY_TRANSACTION, {
    pollInterval: 1000
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div class="section-4">
      <div>
        <h4 class="heading-3">Recent transactions</h4>
      </div>
      <div style={{ display: 'flex', width: '700px', fontSize: '16px' }}>
        <div style={{ width: '10%' }}>Code</div>
        <div style={{ width: '20%' }}>Buyer</div>
        <div style={{ width: '20%' }}>Seller</div>
        <div style={{ width: '10%' }}>Price</div>
        <div style={{ width: '10%' }}>Unit</div>
        <div style={{ width: '30%' }}>Trade Time</div>
      </div>
      <ul class="list">
        {
          data.queryTransaction.slice(0, 8).map(txn => (
            <li class="list-item">
              <TransactionItem txn={txn}></TransactionItem>
            </li>
          ))
        }
      </ul>
    </div>)
}

function PlaceOrderForm() {
  const [stockCode, setStockCode] = React.useState("ANZ");
  const [buyOrSell, setBuyOrSell] = React.useState("Buy");
  const [price, setPrice] = React.useState(0.00);
  const [unit, setUnit] = React.useState(0);
  const [placeOrder] = useMutation(MUTATION_PLACEORDER);
  let input = {};

  return (
    <div class="w-form">
      <div>
        <h4 class="heading-3">Place orders</h4>
      </div>
      <form id="email-form" name="email-form" data-name="Email Form"
        onSubmit={e => {
          e.preventDefault();
          console.log(input);
          placeOrder({
            variables: {
              "stockCode": stockCode,
              "buyOrSell": buyOrSell,
              "price": price,
              "unit": unit
            }
          });
        }}
      >
        <div class="columns-2 w-row">
          <div class="w-col w-col-6" >
            <label for="StockCode-2" class="uiform-label">Stock Code</label>
            <select id="StockCode-2" name="StockCode" required="" onChange={e => setStockCode(e.target.value)} class="select-field w-select">
              <option value="ANZ">ANZ</option>
              <option value="CBA">CBA</option>
            </select>
            <label for="Price" class="uiform-label">Price</label>
            <input type="money" class="text-field w-input" maxlength="256" name="Price" placeholder="1.00" onChange={e => setPrice(parseFloat(e.target.value))} id="Price" required="" />
          </div>
          <div class="w-col w-col-6 ">
            <label for="BuyOrSell-3" class="uiform-label">Buy or sell</label>
            <select id="BuyOrSell-3" name="BuyOrSell-3" onChange={e => setBuyOrSell(e.target.value)} required="" class="select-field w-select">
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
            <label for="Unit" class="uiform-label">Number of unit</label>
            <input type="number" class="text-field-2 w-input" maxlength="256" name="Unit" onChange={e => setUnit(parseInt(e.target.value))} placeholder="100" id="Unit" required="" />

          </div>

        </div>
        <input type="submit" value="Place Order" data-wait="Please wait..." class="submit-button w-button" />

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
            <div>
              <h2>Magento Corp Trading desk</h2>
            </div>
            <QueryMarket></QueryMarket>
            <QueryTransaction></QueryTransaction>
            <PlaceOrderForm></PlaceOrderForm>
          </div>
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
