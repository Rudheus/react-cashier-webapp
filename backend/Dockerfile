FROM node:20-alpine
# Install postgresql-client for the init-db script
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Use wildcards to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Use 'npm ci' for a clean, reliable install from the lockfile
RUN npm install

COPY . .

# Ensure the entrypoint script is executable
RUN chmod +x init-db.sh

EXPOSE 3000

# Railway will use this CMD to start your app
CMD ["sh", "init-db.sh"]