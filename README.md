# Prisma ORM wrapper for FXServer

This is not a complete resource; it's some experimental code and tests for interacting with your database using Prisma.

## Getting Started

1. Download and install any LTS release of [Node.js](https://nodejs.org/en) from v22.
2. Open a command-line terminal (e.g., Terminal, Command Prompt).
3. Enter `node --version` to verify the installation.
4. Run `npm install -g pnpm` to globally install the package manager [pnpm](https://pnpm.io).
5. Install all dependencies with `pnpm i`.
6. Create a new file named `.env` within the root directory.
7. Copy the contents of `.env.example` to the newly created `.env` file and edit accordingly.
8. Add Prisma models to `schema.prisma` and generate Prisma client using `pnpm connect`.
9. Build the resource with `pnpm build`.

Use `pnpm watch` to rebuild whenever a file is modified.