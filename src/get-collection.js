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

  if (query.items) {
    // Get selected items by ID
    items = pick(collection, query.items)

    // Convert to array
    items = toArray(items)
  } else {
    // Convert whole collection to array
    items = toArray(collection)
  }

  if (query.filter) {
    if (query.filter.type === 'date') {
      if (!query.filter.to) {
        throw new Error('You need to define dates range')
      }

      const from = new Date(query.filter.from || 0)
      const to = new Date(query.filter.to)

      items = items.filter(item =>
        inRange(new Date(item[query.filter.prop]), from, to)
      )
    }

    if (query.filter.type === 'number') {
      const from = toNumber(query.filter.from || 0)
      const to = toNumber(query.filter.to || Infinity)

      items = items.filter(item =>
        inRange(toNumber(item[query.filter.prop]), from, to)
      )
    }

    if (query.filter.type === 'value') {
      const value = Array.isArray(query.filter.value)
        ? query.filter.value
        : [query.filter.value]
      items = items.filter(item => value.includes(item[query.filter.prop]))
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
    items = items.splice((query.page - 1) * query.perPage, query.perPage)
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
