const toArray = require('lodash/toArray')
const sortBy = require('lodash/sortBy')
const camelCase = require('lodash/camelCase')
const pick = require('lodash/pick')

module.exports = (content, lang, query) => {
  const name = camelCase(query.name)
  const collection = content[lang]['collection'][name]
  let items = []

  // Move object ID inside element
  Object.keys(collection).forEach(id => {
    collection[id].id = id
  })

  // Get selected items by ID
  if (query.items) {
    items = query.items.map(item => collection[camelCase(item)])
  }
  else {
    // Convert whole collection to array
    items = toArray(collection)
  }

  // Sort by prop
  if (query.sortBy) {
    items = sortBy(items, query.sortBy)

    if (query.sort === 'asc') {
      items = items.reverse()
    }
  }

  if (query.limit) {
    items = items.splice(0, query.limit)
  }

  const pagination = query.page && query.perPage ? {
    total: items.length,
    totalPages: Math.ceil(items.length / query.perPage)
  } : false

  if (query.page && query.perPage) {
    const start = (query.page - 1) * query.perPage
    items = items.splice(start, query.perPage)
  }

  if (query.props) {
    items = items.map(item => {
      return pick(item, query.props)
    })
  }

  if (!items.length) {
    return null
  }

  return {
    items,
    pagination
  }
}
