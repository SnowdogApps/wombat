const path = require('path')
const express = require('express')
const helmet = require('helmet')
const camelCase = require('lodash/camelCase')

const config = require('./config')

const init = async content => {
  const app = express()
  const port = config.port

  // Security
  app.use(helmet())

  // Static assets
  app.use('/', express.static(path.resolve('./public')))

  // Dynamic routes
  app.get('/:type(single|type)?/:name', (request, response) => {
    const type = camelCase(request.params.type)
    const name = camelCase(request.params.name)
    const lang = request.query.lang || config.defaultLang
    try {
      const data = content[lang][type][name]
      if (!data) throw new Error()
      response.send(data)
    }
    catch (e) {
      response.status(404).send(`Cannot GET ${request.url}`)
    }
  })

  app.get('/type/:name/:id', (request, response) => {
    const name = camelCase(request.params.name)
    const id = camelCase(request.params.id)
    const lang = request.query.lang || config.defaultLang

    try {
      const data = content[lang].type[name][id]
      if (!data) throw new Error()
      response.send(data)
    }
    catch (e) {
      response.status(404).send(`Cannot GET ${request.url}`)
    }
  })

  // Listener init
  app.listen(port, () => console.log(`Wombat is listening on port ${port}!`))
}

module.exports = init
