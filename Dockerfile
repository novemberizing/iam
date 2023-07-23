FROM node
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 40001 50001
CMD [ "npm", "run", "start" ]