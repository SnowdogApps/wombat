const getConfing = require('../get-config')
const getEntity = require('../get-entity')
const cors = require('../cors')

module.exports = (content, config, dev = false) => (request, response) => {
  config = getConfing(config)
  const url = new URL(request.url, `http://${request.headers.host}`)
  const name = url.searchParams.get('name')
  const lang = url.searchParams.get('lang') || config.defaultLang

  try {
    cors(request, response, config, dev)

    // Prevent adding content to already sent response
    if (response.writableEnded) {
      return
    }

    const entity = getEntity(content, lang, name)
    if (!entity) {
      throw new Error('Entity not found')
    }

    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify(entity))
  }
  catch (error) {
    console.error(error)
    response.statusCode = 404
    response.end(`Cannot GET ${request.url}`)
  }
}
