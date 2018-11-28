const path = require('path')
const fs = require('fs-extra')

const getProps = require('./get-props')
const toCamelCase = require('./to-camel-case')

module.exports = async typesPath => {
  // Get list of types
  const typesList = await fs.readdir(typesPath)

  let types = await typesList.reduce(async (typesObj, type) => {
    const typesCollection = await typesObj
    const typePath = path.join(typesPath, type)

    // Get list of items inside types
    typesCollection[type] = await fs.readdir(typePath)

    // Get types items content
    typesCollection[type] = await typesCollection[type].reduce(async (itemsObj, item) => {
      const itemCollection = await itemsObj
      const itemPath = path.join(typePath, item)

      itemCollection[item] = await getProps(itemPath)

      return itemCollection
    }, {})

    return typesCollection
  }, {})

  // To camelCase
  types = toCamelCase(types)

  return types
}
