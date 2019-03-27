FROM node:10 as builder

ENV PORT 3000
EXPOSE ${PORT}

WORKDIR /notus-node

RUN npm install -g yarn

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

COPY ./webhook.schema.json ./lib

ENV NODE_ENV production

CMD ["node", "./lib/server.js"]
