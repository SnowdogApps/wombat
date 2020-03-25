const { parse } = require('url')
const config = require('../get-config')
const getEntity = require('../get-entity')
const cors = require('../cors')

module.exports = (content, dev = false) => (request, response) => {
  const params = parse(request.url, true).query
  const name = params.name
  const lang = params.lang || config.defaultLang

  try {
    const entity = getEntity(content, lang, name)

    response.setHeader('Content-Type', 'application/json; charset=utf-8')

    cors(request, response, dev)

    if (!entity) throw new Error('Entity not found')
    response.end(JSON.stringify(entity))
  } catch (e) {
    console.error(e)
    response.statusCode = 404
    response.end(`Cannot GET ${request.url}`)
  }
}
