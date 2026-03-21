#!/bin/sh
echo "Waiting for database..."
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
  sleep 1
done
echo "Database ready! Running schema..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f /app/src/db/schema.sql
echo "Creating default users..."
node /app/src/db/createAdmin.js
echo "Done! Starting server..."
node src/app.js