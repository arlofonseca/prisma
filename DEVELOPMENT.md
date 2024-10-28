### Getting Started

1. Download and install the LTS version of [Node.js](https://nodejs.org/).

2. Open a command-line terminal (e.g., Terminal, Command Prompt).

3. Verify the installation:

```
node --version
```

4. Globally install the package:

```
npm install -g pnpm
```

5. Create your own fork of this repository via the `Fork` button.

6. View your fork:

```
git clone git@github.com:username/prisma.git
```

7. Install all dependencies:

```
pnpm i
```

8. Create a new file named `.env`:

##### _You can create the new file any way you prefer; this is simply the quickest approach for me._

```
nvim .env
```

9. Copy the contents of `.env.example` to the newly created `.env` file and edit accordingly.

Example:

```
DATABASE_URL="mysql://user:password@host:port/name"
```

10. Connect your database to add Prisma models to `schema.prisma`:

```
pnpm pull
```

11. Generate Prisma client:

```
pnpm generate
pnpm sql // Used for TypedSQL
```

12. Be sure that there are no errors and builds successfully:

```
pnpm lint
pnpm build
```

### Useful Commands

1. `pnpm studio` - database management via web
2. `pnpm watch` - rebuilds resource whenever a file is modified
3. `pnpm format` - autoformats using prettier
