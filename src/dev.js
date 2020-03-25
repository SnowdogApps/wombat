const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs-extra')
const portfinder = require('portfinder')

const build = require('./build')
const config = require('./get-config')

const entityRequestHandler = require('./api/entity')
const collectionRequestHandler = require('./api/collection')

module.exports = async () => {
  if (config.dev.build) {
    await build()
  }

  const content = require(path.resolve(config.dest))

  // Start server
  const server = http.createServer((request, response) => {
    const pathName = url.parse(request.url).pathname

    if (pathName === '/entity') {
      entityRequestHandler(content, true)(request, response)
      response.end()
    } else if (pathName === '/collection') {
      collectionRequestHandler(content, true)(request, response)
      response.end()
    } else if (/^\/static\//.test(pathName)) {
      const filePath = path.resolve(pathName.replace(/^\/static/, './public'))

      try {
        if (fs.statSync(filePath).isFile()) {
          response.end(fs.readFileSync(filePath))
        }
      } catch (e) {
        response.writeHead(404, 'File not found')
        response.end()
      }
    } else {
      response.writeHead(404, 'Route not found')
      response.end()
    }
  })

  try {
    portfinder.basePort = config.dev.port
    const port = await portfinder.getPortPromise()
    server.listen(port)
    console.log(`Wombat is listening on port ${port}!`)
  }
  catch(e) {
    throw new Error(e)
  }
}
