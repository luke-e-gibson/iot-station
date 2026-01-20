# Database Migration Setup

This project uses Drizzle ORM for database schema management and migrations.

## How It Works

1. **Schema Definition**: Database schema is defined in `server/src/db/schema.ts`
2. **Migration Generation**: Run `pnpm db:generate` to create migration files in `server/drizzle/`
3. **Migration Execution**: The `migrate` Docker service automatically applies migrations on startup

## Docker Services

- **postgres**: PostgreSQL database (port 5432)
- **migrate**: One-time migration runner that applies Drizzle migrations
- **app**: Main application server (depends on successful migrations)

## Running Migrations

### In Docker (Production)

```bash
docker-compose up
```

The migrations run automatically before the app starts.

### Local Development

```bash
cd server
pnpm db:generate  # Generate migration files from schema changes
```

Then restart Docker services to apply:

```bash
docker-compose down
docker-compose up --build
```

## Making Schema Changes

1. Edit `server/src/db/schema.ts`
2. Run `pnpm db:generate` to create migration SQL files
3. Commit both the schema changes and generated migration files
4. Restart Docker services to apply migrations

## Database Credentials

See `.env.example` for default configuration:
- Database: `weather`
- User: `weather`
- Password: `weather123`
- Port: `5432`

## Troubleshooting

If you see "database does not exist" errors:
1. Stop all containers: `docker-compose down -v` (removes volumes)
2. Rebuild and start: `docker-compose up --build`

If you see column name errors:
1. Make sure migrations have run successfully (check `migrate` service logs)
2. Verify schema uses snake_case for column names
