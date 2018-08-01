# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

FROM node:8-alpine as builder
RUN apk --no-cache add ca-certificates && npm i -g npm@6.2.0
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build

#FROM node:8-alpine
#RUN apk --no-cache add ca-certificates && npm i -g npm@6.2.0
#WORKDIR /usr/bin/app
#COPY --from=builder /usr/src/app/dist .
#ENV NODE_ENV production
#RUN npm install --only=production
#EXPOSE 8080
#CMD [ "node", "index.js" ]
