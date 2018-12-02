const { parse } = require('url')
const { config, getCollection } = require('@snowdog/wombat')

const content = require('./db.json')

module.exports = async (request, response) => {
  const params = parse(request.url, true).query
  const type = 'collection'
  const name = params.name
  const lang = params.lang || config.defaultLang

  const filter = {
    items: params.items ? params.items.split(',') : null,
    limit: params.limit,
    sort: params.sort,
    sortBy: params.sortBy
  }

  try {
    const collection = content[lang][type][name]
    const data = getCollection(collection, filter)

    if (!data) throw new Error()
    response.end(JSON.stringify(data))
  }
  catch (e) {
    response.statusCode = 404
    response.end(`Cannot GET ${request.url}`)
  }
}
