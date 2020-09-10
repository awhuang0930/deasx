
export const HomePage_Actions = `
    type HomePage_FirstLoad {
      heartBeat: HeartBeat
    }`;

export const Orders_Actions = `
    type Query_Orders ($stockCode:String!){
      order : Order
    }`;
