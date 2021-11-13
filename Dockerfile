# Basix

FROM node:16

WORKDIR /usr/src/psycryptbot

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "."]
