const camelCase = require('lodash.camelcase')

const getCollection = require('./get-collection')

module.exports = (content, lang, name) => {
  name = camelCase(name)
  let entity = content?.[lang]?.['entity']?.[name]

  if (entity) {
    Object.keys(entity).map(prop => {
      if (entity[prop].query) {
        const collection = getCollection(
          content,
          lang,
          entity[prop].query
        )

        if (collection) {
          entity[prop] = collection.items
        }
      }
    })
  }

  return entity
}
