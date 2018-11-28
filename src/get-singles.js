const path = require('path')
const fs = require('fs-extra')

const getProps = require('./get-props')
const toCamelCase = require('./to-camel-case')

module.exports = async (singlesPath, types) => {
  // Get list of singles
  const singlesList = await fs.readdir(singlesPath)

  let singles = await singlesList.reduce(async (singlesObj, type) => {
    const singlesCollection = await singlesObj
    const typePath = path.join(singlesPath, type)

    singlesCollection[type] = await getProps(typePath, types)

    return singlesCollection
  }, {})

  // To camelCase
  singles = toCamelCase(singles)

  return singles
}
