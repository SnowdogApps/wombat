const { parse } = require('url')
const camelCase = require('lodash.camelcase')
const getConfing = require('../get-config')
const getCollection = require('../get-collection')
const cors = require('../cors')

module.exports = (content, config) => (request, response, dev = false) => {
  config = getConfing(config)
  const params = parse(request.url, true).query
  const lang = params.lang || config.defaultLang

  // Transform comma separated strings lists to arrays
  Object.keys(params)
    .filter(key => key === 'items' || key === 'props')
    .forEach(key => params[key] = params[key].split(',').map(key => camelCase(key)))

  // Parse JSON
  Object.keys(params)
    .filter(key => key === 'range')
    .forEach(key => params[key] = JSON.parse(params[key]))

  try {
    const collection = getCollection(content, lang, params)

    response.setHeader('Content-Type', 'application/json; charset=utf-8')

    cors(request, response, config, dev)

    if (collection.pagination) {
      response.setHeader('X-Wombat-Total', collection.pagination.total)
      response.setHeader('X-Wombat-TotalPages', collection.pagination.totalPages)
    }

    response.end(JSON.stringify(collection.items))
  }
  catch (e) {
    console.error(e)
    response.statusCode = 404
    response.end(`Cannot GET ${request.url}`)
  }
}
