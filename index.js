const camelCase = require('lodash/camelCase')

const config = require('./src/config')
const getContent = require('./src/content')
const getServer = require('./src/server')

async function init() {
  // Prepare content
  const content = await getContent()

  // Boot server
  const server = await getServer()

  // Register routes
  server.route({
    method: ['GET'],
    path: '/{type}/{name}/{id?}',
    handler: request => {
      const type = camelCase(request.params.type)
      const name = camelCase(request.params.name)
      const id = camelCase(request.params.id)
      const lang = request.query.lang || config.defaultLang

      if (id) {
        return content[lang][type][name][id]
      }

      return content[lang][type][name]
    }
  })
}

module.exports = init
