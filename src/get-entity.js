const camelCase = require('lodash/camelCase')
const getData = require('./get-data')

module.exports = (content, lang, name) => {
  name = camelCase(name)
  const entity = content[lang]['entity'][name]

  Object.keys(entity).map(prop => {
    const query = entity[prop].query

    if (query) {
      const data = getData(
        content,
        lang,
        query
      )
      if (data) {
        entity[prop] = data.items
      }
    }
  })

  return entity
}
