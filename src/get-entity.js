const camelCase = require('lodash/camelCase')

const getCollection = require('./get-collection')

module.exports = (content, lang, name) => {
  name = camelCase(name)
  const entity = content[lang]['entity'][name]

  Object.keys(entity).map(prop => {
    if (entity[prop].collectionName) {
      const collection = getCollection(
        content,
        lang,
        entity[prop].collectionName,
        entity[prop].query
      )

      if (collection) {
        entity[prop] = collection.items
      }
    }
  })

  return entity
}
