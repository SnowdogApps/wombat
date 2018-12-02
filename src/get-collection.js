const toArray = require('lodash/toArray')
const sortBy = require('lodash/sortBy')
const camelCase = require('lodash/camelCase')

module.exports = (collectionObj, config = {}) => {
  const collection = Object.assign({}, collectionObj)
  let items = []

  // Move object ID inside element
  Object.keys(collection).forEach(id => {
    collection[id].id = id
  })

  // Get selected items by ID
  if (config.items) {
    const itemIds = toArray(config.items)
    items = itemIds
      .map(item => camelCase(item))
      .map(item => collection[item])
  }
  else {
    // Convert whole collection to array
    items = toArray(collection)
  }

  // Sort by prop
  if (config.sortBy) {
    items = sortBy(items, config.sortBy)

    if (config.sort === 'asc') {
      items = items.reverse()
    }

    if (config.limit) {
      items = items.splice(0, config.limit)
    }
  }

  return items
}
