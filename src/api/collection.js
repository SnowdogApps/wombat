const camelCase = require('lodash.camelcase')
const getConfing = require('../get-config')
const getCollection = require('../get-collection')
const cors = require('../cors')

module.exports = (content, config, dev = false) => (request, response) => {
  config = getConfing(config)
  const url = new URL(request.url, `http://${request.headers.host}`)
  const params = Object.fromEntries(url.searchParams)
  const lang = params.lang || config.defaultLang

  // Transform comma separated strings lists to arrays
  Object.keys(params)
    .filter(key => key === 'items' || key === 'props')
    .forEach(key => params[key] = params[key].split(',').map(key => camelCase(key)))

  // Parse JSON
  Object.keys(params)
    .filter(key =>  ['filter', 'range'].includes(key))
    .forEach(key => params[key] = JSON.parse(params[key]))

  try {
    cors(request, response, config, dev)

    // Prevent adding content to already sent response
    if (response.writableEnded) {
      return
    }

    const collection = getCollection(content, lang, params)

    if (collection.pagination) {
      response.setHeader('X-Wombat-Total', collection.pagination.total)
      response.setHeader('X-Wombat-TotalPages', collection.pagination.totalPages)
    }

    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify(collection.items))
  }
  catch (error) {
    console.error(error)
    response.statusCode = 404
    response.end(`Cannot GET ${request.url}`)
  }
}
