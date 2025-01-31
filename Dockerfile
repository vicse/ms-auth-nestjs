FROM node:22.13.1-alpine3.21

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY src .

EXPOSE 3000