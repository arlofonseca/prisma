fx_version 'cerulean'
game 'gta5'

name 'prisma'
author 'arlofonseca'
description 'JavaScript/TypeScript tool containing tests to use Prisma ORM within FiveM'
version '1.0.2'
repository 'https://github.com/arlofonseca/prisma'
license 'MIT'

server_script 'dist/server/*.js'

dependencies {
  '/server:7290',
  '/onesync',
  'ox_lib',
  'ox_core'
}