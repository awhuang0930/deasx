export const HeartBeat = `
	type HeartBeat {
	 id: Int
	 name: String!
	 desc: String
	}
`;

export const Token = `
	type Token {
		userId: Int!
		userName: String!
		tokenString: String!
	}
`;


export const Order = `
	type Order {
		key: String!
		class: String!
		stockCode: String!
		buyOrSell: String!
		price: Float!
		unit: Int!
		unitOnMarket: Int!
		currentState: Int!
	}
`;

