const { parse } = require('url')
const { config, getEntity } = require('@snowdog/wombat')

module.exports = async (request, response) => {
  const params = parse(request.url, true).query
  const name = params.name
  const lang = params.lang || config.defaultLang

  try {
    const entity = await getEntity(lang, name)

    if (!entity) throw new Error()
    response.end(JSON.stringify(entity))
  }
  catch (e) {
    response.statusCode = 404
    response.end(`Cannot GET ${request.url}`)
  }
}
