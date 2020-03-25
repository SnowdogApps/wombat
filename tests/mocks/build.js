const path = require('path')
const build = require('../../src/build')
const config = require('../../src/get-config')

// override the config with mock values
config.src = path.join(__dirname, 'content')
config.dest = path.join(__dirname, 'wombat.db.json')

build()
