const { parse } = require('url')
const { config, getCollection } = require('@snowdog/wombat')

module.exports = content => async (request, response) => {
  const params = parse(request.url, true).query
  const name = params.name
  const lang = params.lang || config.defaultLang
  const query = params.query

  try {
    const collection = await getCollection(content, lang, name, query)

    if (!collection.items) throw new Error()

    if (collection.pagination) {
      response.setHeader('X-Wombat-Total', collection.pagination.total)
      response.setHeader('X-Wombat-TotalPages', collection.pagination.totalPages)
    }

    response.end(JSON.stringify(collection.items))
  }
  catch (e) {
    response.statusCode = 404
    response.end(`Cannot GET ${request.url}`)
  }
}
