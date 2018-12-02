const { parse } = require('url')
const { config } = require('@snowdog/wombat')

const content = require('./db.json')

module.exports = async (request, response) => {
  const params = parse(request.url, true).query
  const type = 'entity'
  const name = params.name
  const lang = params.lang || config.defaultLang

  try {
    const data = content[lang][type][name]

    if (!data) throw new Error()
    response.end(JSON.stringify(data))
  }
  catch (e) {
    response.statusCode = 404
    response.end(`Cannot GET ${request.url}`)
  }
}
