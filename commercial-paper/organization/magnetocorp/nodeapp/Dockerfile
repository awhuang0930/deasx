# To build docker image in Windows10
# 1. docker build -f Dockerfile -t gqlapi-local:v1.0 .

# To Run the image in Windows 10
# docker run --rm -p 92:8000 --name gql02 gqlapi-local:v1.0

# To Run the image in background in Windows 10
# docker run -d --rm -p 92:8000 --name gql02 gqlapi-local:v1.0

# To verify the running status of the iamge
# 1. Enable inbound rule in windows10's firewall for the ODataApi's port (#90)
# 2. Find the local pc's ip by ipconfig.exe
# visit http://localhost:92/graphql and input following
#
# mutation {
#   heartbeatadd(uri: "http://192.168.187.193:90/OData/AllanNotice"){
# 		Id,
# 	    Name,
#       Desc
#   }
# }

# Note: 192.168.187.193 can be changed to AllanLocal in allan's laptop.


###############################
# Full Version of GqlApi Server
###############################

FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/src
WORKDIR /home/node/app
COPY ./package.json ./
COPY ./app.prod.config.yaml ./app.config.yaml

USER node
RUN npm install --production
#RUN npm audit fix
#RUN link /home/node/app/node_modules/ts-node/dist/bin.js /home/node/app/ts-node 
COPY --chown=node:node ./app.ts ./app.ts
COPY --chown=node:node ./tsconfig.json ./tsconfig.json
COPY --chown=node:node ./app.prod.config.yaml ./app.config.yaml
COPY --chown=node:node ./src ./src/
#EXPOSE 8000
CMD [ "/home/node/app/node_modules/ts-node/dist/bin.js", "app.ts" ]