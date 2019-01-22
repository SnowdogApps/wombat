const { parse } = require('url')
const config = require('../config')
const getCollection = require('../get-collection')
const cors = require('./cors')

module.exports = content => (request, response, dev = false) => {
  const params = parse(request.url, true).query
  const lang = params.lang || config.defaultLang

  // Transform comma separated strings lists to arrays
  Object.keys(params)
    .filter(key => key === 'items' || key === 'props')
    .forEach(key => params[key] = params[key].split(','))

  try {
    const collection = getCollection(content, lang, params)

    if (!collection.items) throw new Error('Collection not found')

    cors(request, response, dev)

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
