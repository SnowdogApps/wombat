const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs-extra')
const portfinder = require('portfinder')

const config = require('./config')
const build = require('./build')
const getContent = require('./get-content')

const cors = require('./api/cors')
const entityRequestHandler = require('./api/entity')
const collectionRequestHandler = require('./api/collection')

portfinder.basePort = config.dev.port

module.exports = async () => {
  // Prepare content
  if (config.dev.build) {
    await build()
  }

  const content = getContent()

  const server = http.createServer((request, response) => {
    cors(request, response, true)

    const pathName = url.parse(request.url).pathname

    if (pathName === '/entity') {
      entityRequestHandler(content)(request, response)
      response.end()
    }
    else if (pathName === '/collection') {
      collectionRequestHandler(content)(request, response)
      response.end()
    }
    else if (/^\/static\//.test(pathName)) {
      const filePath = path.resolve(pathName.replace(/^\/static/, './public'))

      try {
        if (fs.statSync(filePath).isFile()) {
          response.end(fs.readFileSync(filePath))
        }
      }
      catch(e) {
        response.writeHead(404, 'File not found')
        response.end()
      }
    }
    else {
      response.writeHead(404, 'Route not found')
      response.end()
    }
  })

  try {
    const port = await portfinder.getPortPromise()
    server.listen(port)
    console.log(`Wombat is listening on port ${port}!`)
  } catch(e) {
    throw new Error(e)
  }
}
