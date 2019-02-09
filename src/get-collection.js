const toArray = require('lodash.toarray')
const sortBy = require('lodash.sortby')
const camelCase = require('lodash.camelcase')
const pick = require('lodash.pick')

module.exports = (content, lang, query) => {
  const name = camelCase(query.name)
  const collection = content[lang]['collection'][name]
  let items = []

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

    if (query.sort === 'desc') {
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
