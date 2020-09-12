# 
# Build docker
# docker build -t reactapollo:v1.0 .

# get the base node image
FROM node:12.13.0-alpine as builder

# set the working dir for container
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./

# install npm dependencies
RUN npm ci
RUN npm install react-scripts@3.4.1 -g 

# add app
COPY . ./

# start app
#CMD ["npm", "start"]
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]