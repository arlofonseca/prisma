fx_version 'cerulean'
game 'gta5'
node_version '22'

name 'prisma'
author 'arlofonseca'
description 'JavaScript/TypeScript tool containing examples of how to use Prisma ORM for FiveM'
version '1.0.3'
repository 'https://github.com/arlofonseca/prisma'
license 'MIT'

server_script 'dist/server.js'

dependencies {
  '/server:12913',
  '/onesync',
  'ox_lib',
  'ox_core'
}