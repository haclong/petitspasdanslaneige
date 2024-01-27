FROM node:current-slim

WORKDIR /usr/src/app
COPY . .

RUN npm install -g npm@10.4.0
RUN npm install --save-dev


EXPOSE 8080 

CMD ["npx", "@11ty/eleventy", "--serve"]
