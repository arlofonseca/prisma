fx_version 'cerulean'
game 'gta5'

version '1.0.0'
author 'arlofonseca'
repository 'https://github.com/arlofonseca/prisma'

server_scripts {
  'dist/server.js',
}

dependencies {
  '/server:7290',
  '/onesync',
  'ox_lib',
}

lua54 'yes'
use_experimental_fxv2_oal 'yes'
