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

6. Check out your fork:

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

9. Copy the contents of `.env.example` to the newly created `.env` file and edit accordingly:

```
DATABASE_URL="mysql://user:password@host:3306/name"
```

10. Connect your database and add Prisma models to your Prisma schema:

```
pnpm pull
```

11. Generate all necessary assets:

```
pnpm generate
```

12. Build the resource:

```
pnpm build
```

### Useful Commands

4. `pnpm studio` - database management via web
5. `pnpm watch` - rebuilds resource whenever a file is modified
6. `pnpm format` - autoformats using prettier
