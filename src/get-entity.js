const camelCase = require('lodash/camelCase')
const getContent = require('./get-content')

const getCollection = require('./get-collection')

module.exports = async (lang, name) => {
  name = camelCase(name)
  const content = await getContent()
  const entity = content[lang]['entity'][name]

  await Promise.all(
    Object.keys(entity).map(async prop => {
      if (entity[prop].collectionName) {
        const collection = await getCollection(
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
