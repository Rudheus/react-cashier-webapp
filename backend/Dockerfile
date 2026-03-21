FROM node:20-alpine
RUN apk add --no-cache postgresql-client
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
RUN chmod +x init-db.sh
EXPOSE 3000
CMD ["sh", "init-db.sh"]