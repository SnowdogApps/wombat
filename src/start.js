const build = require('./build')
const getContent = require('./get-content')
const server = require('./server')

module.exports = async () => {
  // Build db
  await build()

  // Get conent and start server
  server(await getContent())
}
