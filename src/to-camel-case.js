const camelCase = require('lodash/camelCase')

module.exports = items => {
  return Object.keys(items).reduce((obj, type) => {
    obj[camelCase(type)] = items[type]
    return obj
  }, {})
}

