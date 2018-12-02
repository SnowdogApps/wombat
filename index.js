const build = require('./src/build')
const config = require('./src/config')
const getCollection = require('./src/get-collection')
const getContent = require('./src/get-content')
const start = require('./src/start')
const server = require('./src/server')

module.exports = {
  build,
  config,
  getCollection,
  getContent,
  server,
  start
}
