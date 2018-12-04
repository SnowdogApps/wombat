const camelCase = require('lodash/camelCase')

const getCollection = require('./get-collection')

module.exports = async (content, lang, name) => {
  name = camelCase(name)
  const entity = content[lang]['entity'][name]

  await Promise.all(
    Object.keys(entity).map(async prop => {
      if (entity[prop].collectionName) {
        const collection = await getCollection(
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
  )

  return entity
}
