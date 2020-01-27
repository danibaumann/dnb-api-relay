FROM node:10-alpine

LABEL maintainer="Daniel Baumann <daniel.baumann@bisnode.com>"

## Create working dirs
RUN mkdir -p /home/node/app/node_modules && \
  chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "npm", "start" ]