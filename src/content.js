const path = require('path')

const init = async (lang) => {
  const types = require('./get-types')
  const singles = require('./get-singles')

  const contentPath = path.resolve('./content')
  const typesPath = path.join(contentPath, lang, 'type')
  const singlesPath = path.join(contentPath, lang, 'single')

  const typesData = await types(typesPath)
  const singlesData = await singles(singlesPath, typesData)

  return {
    type: typesData,
    single: singlesData
  }
}

module.exports = init
