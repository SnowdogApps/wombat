const toArray = require('lodash/toArray')
const sortBy = require('lodash/sortBy')
const pick = require('lodash/pick')

module.exports = (collection, config) => {
  if (config.items) {
    collection = pick(collection, config.items)
  }

  if (config.sortBy) {
    Object.keys(collection).forEach(id => {
      collection[id].id = id
    })

    collection = toArray(collection)
    collection = sortBy(collection, config.sortBy)

    if (config.sort === 'asc') {
      collection = collection.reverse()
    }

    if (config.limit) {
      collection = collection.splice(0, config.limit)
    }
  }

  return collection
}
