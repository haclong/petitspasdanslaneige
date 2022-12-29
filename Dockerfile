FROM node:current-slim

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install --save-dev @11ty/eleventy

EXPOSE 8080

CMD "npm" "start"
