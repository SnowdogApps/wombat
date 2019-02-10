const toArray = require('lodash.toarray')
const sortBy = require('lodash.sortby')
const camelCase = require('lodash.camelcase')
const pick = require('lodash.pick')
const shuffle = require('lodash.shuffle')
const reverse = require('lodash.reverse')
const take = require('lodash.take')
const inRange = require('lodash.inrange')
const toNumber = require('lodash.tonumber')

module.exports = (content, lang, query) => {
  const name = camelCase(query.name)
  const collection = content[lang]['collection'][name]
  let items = []

  // Get selected items by ID
  if (query.items) {
    items = pick(collection, query.items)
  }
  else {
    // Convert whole collection to array
    items = toArray(collection)
  }

  if (query.range) {
    if (query.range.type === 'date') {
      if (!query.range.end) {
        throw new Error('You need to define dates range')
      }

      const start = new Date(query.range.start || 0)
      const end = new Date(query.range.end)

      items = items.filter(item => inRange(
        new Date(item[query.range.prop]),
        start,
        end
      ))
    }

    if (query.range.type === 'number' || !query.range.type) {
      const start = toNumber(query.range.start || 0)
      const end = toNumber(query.range.end || Infinity)

      items = items.filter(item => inRange(
        toNumber(item[query.range.prop]),
        start,
        end
      ))
    }
  }

  // Sort by prop
  if (query.sortBy) {
    items = sortBy(items, query.sortBy)

    if (query.sort === 'desc') {
      items = reverse(items)
    }
  }

  if (query.shuffle === 'true') {
    items = shuffle(items)
  }

  if (query.limit) {
    items = take(items, query.limit)
  }

  // Pagination
  let pagination = false

  if (query.page && query.perPage) {
    // Set totals
    pagination = {
      total: items.length,
      totalPages: Math.ceil(items.length / query.perPage)
    }

    // Pick only items from current page
    items = items.splice(
      (query.page - 1) * query.perPage,
      query.perPage
    )
  }

  // Return only selected object properties
  if (query.props) {
    items = items.map(item => pick(item, query.props))
  }

  return {
    items,
    pagination
  }
}
