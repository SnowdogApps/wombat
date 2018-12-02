const { parse } = require('url')
const { config, getContent } = require('@snowdog/wombat')

module.exports = async (request, response) => {
  const params = parse(request.url, true).query
  const type = 'entity'
  const name = params.name
  const lang = params.lang || config.defaultLang

  try {
    const content = await getContent()
    const data = content[lang][type][name]

    if (!data) throw new Error()
    response.end(data)
  }
  catch (e) {
    response.statusCode = 404
    response.end(`Cannot GET ${request.url}`)
  }
}
