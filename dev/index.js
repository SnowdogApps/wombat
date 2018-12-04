const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const wombat = require('../index')
const config = wombat.config
const build = wombat.build
const getContent = wombat.getContent
const getEntity = wombat.getEntity
const getCollection = wombat.getCollection

module.exports = async () => {
  // Build db
  await build()

  // Start server
  const app = express()
  const port = config.port

  // Prepare content
  const content = await getContent()

  // Security
  app.use(cors())
  app.use(helmet())

  // Static assets
  app.use('/static', express.static(path.resolve('./public')))

  // Dynamic routes
  app.get('/entity/:name', async (request, response) => {
    const name = request.params.name
    const lang = request.query.lang || config.defaultLang

    try {
      const entity = await getEntity(content, lang, name)

      if (!entity) throw new Error()
      response.send(entity)
    }
    catch (e) {
      response.status(404).send(`Cannot GET ${request.url}`)
    }
  })

  app.get('/collection/:name', async (request, response) => {
    const name = request.params.name
    const lang = request.query.lang || config.defaultLang
    const query = request.query.query ? JSON.parse(request.query.query) : undefined

    try {
      const collection = await getCollection(content, lang, name, query)

      if (!collection.items) throw new Error()

      if (collection.pagination) {
        response.setHeader('X-Wombat-Total', collection.pagination.total)
        response.setHeader('X-Wombat-TotalPages', collection.pagination.totalPages)
      }
      response.send(collection.items)
    }
    catch (e) {
      response.status(404).send(`Cannot GET ${request.url}`)
    }
  })

  // Listener init
  app.listen(port, () => console.log(`Wombat is listening on port ${port}!`))
}
