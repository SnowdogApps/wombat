const path = require('path')
const fs = require('fs-extra')
const camelCase = require('lodash/camelCase')

const getTypeItem = require('./get-type-item')

// Markdown to HTML
const showdown = require('showdown')
const converter = new showdown.Converter()

module.exports = async (itemPath, types) => {
  const files = await fs.readdir(itemPath, { withFileTypes: true })

  return files.reduce(async (obj, file) => {
    const propsCollection = await obj
    const propName = camelCase(file.replace(/\..*/, ''))
    const filePath = path.join(itemPath, file)
    const fileContent = await fs.readFile(filePath, 'utf8')

    // Markdown
    if (filePath.endsWith('.md')) {
      propsCollection[propName] = converter.makeHtml(fileContent)
      return propsCollection
    }

    // JSON
    if (filePath.endsWith('.json')) {
      let content = JSON.parse(fileContent)

      // Returing related types
      if (types && content.type) {
        content = getTypeItem(content, types)
      }

      propsCollection[propName] = content
      return propsCollection
    }

    // Other
    propsCollection[propName] = fileContent
    return propsCollection
  }, {})
}
