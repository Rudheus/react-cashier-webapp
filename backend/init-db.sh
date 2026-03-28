#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status

echo "Waiting for database at $DB_HOST:$DB_PORT..."

# Try connecting for max 30 seconds
NEXT_WAIT_TIME=0
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" || [ $NEXT_WAIT_TIME -eq 30 ]; do
  sleep 1
  NEXT_WAIT_TIME=$((NEXT_WAIT_TIME+1))
done

if [ $NEXT_WAIT_TIME -eq 30 ]; then
  echo "Error: Database connection timed out."
  exit 1
fi

echo "Database ready! Running schema..."
PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f /app/src/db/schema.sql

echo "Creating default users..."
node /app/src/db/createAdmin.js

echo "Done! Starting server..."
node src/app.js