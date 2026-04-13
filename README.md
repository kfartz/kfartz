# Kfartz

[![CI](https://github.com/kfartz/kfartz/actions/workflows/code-check.yml/badge.svg)](https://github.com/kfartz/kfartz/actions/workflows/code-check.yml)

<p align="center">
    <img
        width="100"
        src="public/favicon.png"
        alt="kfartz logo"
        />
</p>

A crystallography measurement metadata database for managing crystal structure analysis data.

## Features

- **Complete data workflow** - Track crystals, measurements, processings, refinements, and publications
- **CIF file import** - Quickly populate refinement data from crystallographic information files
- **Powerful search** - Query syntax with operators for precise filtering
- **Role-based access** - Regular users can view and create; admins can edit and delete
- **Keyboard shortcuts** - Fast navigation for power users

## Quick Start (Docker)

1. Create a `.env-docker` file:

   ```env
   DATABASE_URI=postgres://postgres:yourpassword@postgres:5432/kfartz
   PAYLOAD_SECRET=your-secret-key-at-least-24-chars
   POSTGRES_PASSWORD=yourpassword
   ```

   > Replace `yourpassword` with a secure password and `your-secret-key-at-least-24-chars` with a random string (24+ characters).

2. Start the application:

   ```bash
   docker compose up
   ```

3. Open <http://localhost:3000/admin> in your browser

4. Create your first admin account using the registration form

5. Start using Kfartz at <http://localhost:3000>

## Documentation

See the [User Manual](docs/README.md) for complete documentation:

- [Getting Started](docs/getting-started/overview.md) - Overview and navigation
- [User Guide](docs/user-guide/viewing-data.md) - Viewing, searching, and adding data
- [Admin Guide](docs/admin-guide/user-management.md) - User and data management
- [Reference](docs/reference/keyboard-shortcuts.md) - Shortcuts and search syntax

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) 1.3+
- [Node.js](https://nodejs.org/) 22+
- [PostgreSQL](https://www.postgresql.org/) 18+

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/kfartz/kfartz.git
   cd kfartz
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Create a `.env` file:

   ```env
   DATABASE_URI=postgres://postgres:password@127.0.0.1:5432/kfartz
   PAYLOAD_SECRET=your-secret-key-at-least-24-chars
   ```

4. Start PostgreSQL and create the database:

   ```bash
   # Using Docker for just the database:
   docker run -d --name kfartz-db \
     -e POSTGRES_PASSWORD=password \
     -p 5432:5432 \
     postgres:18.1-alpine

   # Create the database
   docker exec -it kfartz-db createdb -U postgres kfartz
   ```

5. Run database migrations:

   ```bash
   bun run payload migrate
   ```

6. Start the development server:

   ```bash
   bun run dev
   ```

7. Open <http://localhost:3000/admin> and create your admin account

## Contributing

### Development Workflow

1. Create a feature branch from `master`
2. Make your changes
3. Run linting and formatting checks:

   ```bash
   bun run lint
   bun run format
   ```

4. Commit using [conventional commits](https://www.conventionalcommits.org/)
5. Open a pull request
