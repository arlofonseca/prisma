<h1 align="center">Monorepo for Prisma within FiveM</h1>

<p align="center">
  <a href="https://github.com/arlofonseca/prisma/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="License: MIT">
  </a>
  <a href="https://github.com/arlofonseca/prisma/commits/main/">
    <img src="https://img.shields.io/github/last-commit/arlofonseca/prisma.svg?style=flat" alt="Last commit">
  </a>
</p>

<p align="center">
	<h2 align="center"><a href="https://www.prisma.io/docs/orm/reference/prisma-client-reference">Documentation</a></h2>
</p>

## Features

- Database management through class object (e.g., `Prisma`).
- Prisma generates TypeScript types based on your database schema for compile-time checks.
- Perform queries without writing raw SQL.
- Supports various databases (e.g., PostgreSQL, MySQL, and MariaDB).

## Installation

### Building this resource

1. Download and install the LTS version of Node.js.
2. Open a command-line terminal (e.g., Terminal, Command Prompt).
3. Enter `node --version` to verify the installation.
4. Run `npm install -g pnpm` to globally install the package.
5. Download or clone the repository with `git clone https://github.com/arlofonseca/prisma`.
6. Install all dependencies with `pnpm i`.
7. Create a new file named `.env`.
8. Copy the contents of `.env.example` to the newly created `.env` file and edit accordingly:
   - `DATABASE_URL` is the URL for your database.
9. Run `pnpm pull` to connect to your database.
10. Now run the command `pnpm generate`.
11. Build the resource with `pnpm build`.

Use `pnpm watch` to rebuild whenever a file is modified.
