This resource was created to work with [ox_core](https://github.com/overextended/ox_core). Most of the code has been left out/removed for obvious reasons, basically this is just a starting point for using [prisma](https://www.prisma.io) within FiveM.

### Building this resource

1. Download and install the LTS version of Node.js.
2. Open a command-line terminal (e.g., Terminal, Command Prompt).
3. Enter `node --version` to verify the installation.
4. Run `npm install -g pnpm` to globally install the package.
5. Download or clone the repository with `git clone https://github.com/arlofonseca/prisma`.
6. Install all dependencies with `pnpm i`.
7. Create a new file named `.env`.
8. Copy the contents of `.env.example` to the newly created `.env` file and edit accordingly:
   * `DATABASE_URL` is the data for your database.
9. Run `pnpm pull` to connect your database.
10. Now run the command `pnpm generate`.
11. Build the resource with `pnpm build`.

Use `pnpm watch` to rebuild whenever a file is modified.