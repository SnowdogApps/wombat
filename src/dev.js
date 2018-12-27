const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs-extra')

const config = require('./config')
const build = require('./build')
const getContent = require('./get-content')

module.exports = async () => {
  const entityRequestHandler = require('./api/entity')
  const collectionRequestHandler = require('./api/collection')

  // Prepare content
  await build()
  const content = await getContent()

  const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET')
    response.setHeader('Access-Control-Max-Age', 2592000)

    if (request.method === 'OPTIONS') {
      response.statusCode = 204
      response.end()
      return
    }

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

  server.listen(config.port)
  console.log(`Wombat is listening on port ${config.port}!`)
}
