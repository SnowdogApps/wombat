const path = require('path')
const express = require('express')
const helmet = require('helmet')
const camelCase = require('lodash/camelCase')

const config = require('./config')
const filterCollection = require('./get-collection')

const init = async content => {
  const app = express()
  const port = config.port

  // Security
  app.use(helmet())

  // Static assets
  app.use('/', express.static(path.resolve('./public')))

  // Dynamic routes
  app.get('/entity/:name', (request, response) => {
    const type = 'entity'
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

  app.get('/collection/:name', (request, response) => {
    const type = 'collection'
    const name = camelCase(request.params.name)
    const lang = request.query.lang || config.defaultLang

    const filter = {
      items: request.query.items ? request.query.items.split(',') : null,
      limit: request.query.limit,
      sort: request.query.sort,
      sortBy: request.query.sortBy
    }

    try {
      let data = content[lang][type][name]

      data = filterCollection(data, filter)

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
