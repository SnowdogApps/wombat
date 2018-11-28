const isArray = require('lodash/isArray')
const toArray = require('lodash/toArray')
const sortBy = require('lodash/sortBy')
const pick = require('lodash/pick')
const camelCase = require('lodash/camelCase')

module.exports = (config, types) => {
  const type = camelCase(config.type)

  if (isArray(config.items)) {
    return pick(types[type], config.items)
  }

  if (config.items.qty && config.items.sortBy) {
    let items = toArray(types[type])
    items = sortBy(items, [config.items.sortBy])

    if (config.items.order === 'desc') {
      items = items.reverse()
    }

    return items.splice(0, config.items.qty)
  }

  return {}
}
