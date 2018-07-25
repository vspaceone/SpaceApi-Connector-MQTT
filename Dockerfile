FROM node:carbon

WORKDIR /usr/src/app
VOLUME /usr/src/app/config
COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "start" ]