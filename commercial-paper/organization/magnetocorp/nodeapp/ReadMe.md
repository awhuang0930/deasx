# GraphQL

## To run
npm start
## To Debug
npm run-script start:watch

### Other Types
- Query
- Mutation


## End-To-End(GraphQL Client -> GraphQl Server -> NopApi -> Nop Database) HeartBeat Testing

PreRequest: 
1. ODataApi Docker Run as:  
~~~~~~~
docker run -d --rm -p 90:80 --name odata02 odataapi-dev:v1.0
~~~~~~~
2. in the local test Database has a record with Id=2 in AllanNotice table ( Need to optimize with min(Id) by adding a default HeartBeat API Controller in ODataApi)

~~~~~~~~~~~~
query {
  heartbeatget(uri: "http://localhost:90/OData/AllanNotice") {
		Id,
		Name,
    Desc
  }
}
~~~~~~~~~~~~

or 
~~~~~~~~~~~~
mutation {
  heartbeatadd(uri: "http://localhost:90/OData/AllanNotice"){
		Id,
		Name,
    Desc
  }
}
~~~~~~~~~~~~
