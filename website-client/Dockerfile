FROM node:14.4-alpine

WORKDIR /app

EXPOSE 5000

COPY package.json yarn.lock ./
RUN yarn install

COPY public/ ./public/
COPY tsconfig.json ./
COPY src/ ./src/

RUN yarn build

CMD yarn start-prod
