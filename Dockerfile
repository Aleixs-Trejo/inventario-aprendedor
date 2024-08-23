FROM node:20.11.1

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4321

CMD [ "npm", "run", "dev" ]