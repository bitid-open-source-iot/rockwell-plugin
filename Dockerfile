FROM node:14.17-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN apk add g++ make python
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8080
CMD ["node", "--inspect=9229", "index.js"]
