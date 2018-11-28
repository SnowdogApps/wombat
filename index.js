const getContent = require('./src/content')
const getServer = require('./src/server')

async function init() {
  // Prepare content
  const content = await getContent()

  // Start server
  await getServer(content)
}

module.exports = init
