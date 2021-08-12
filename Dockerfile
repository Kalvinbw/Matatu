FROM node:14.17.1
WORKDIR /usr/src/app
COPY . .

WORKDIR /usr/src/app/client
COPY ./client/package*.json ./
RUN npm install
RUN npm run build

WORKDIR /usr/src/app/server
COPY ./server/package*.json ./
RUN npm install

EXPOSE 8080
USER node
CMD [ "npm", "run", "start" ]
