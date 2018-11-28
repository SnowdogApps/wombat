const fs = require('fs-extra')
const path = require('path')
const camelCase = require('lodash/camelCase')
const isArray = require('lodash/isArray')
const toArray = require('lodash/toArray')
const sortBy = require('lodash/sortBy')
const pick = require('lodash/pick')
const showdown = require('showdown')
const converter = new showdown.Converter()

const walk = async dir => {
  const tree = {}
  const files = await fs.readdir(dir)

  for (let file of files) {
    const filePath = path.join(dir, file)
    const fileName = path.basename(filePath)
    const propName = camelCase(fileName.replace(/\..*/, ''))
    const stat = await fs.stat(filePath)

    if (stat.isDirectory()) {
      tree[propName] = await walk(filePath)
    }

    if (stat.isFile()) {
      const content = await fs.readFile(filePath, 'utf8')
      const extension = path.extname(filePath)

      switch(extension) {
        case '.json':
          tree[propName] = JSON.parse(content)
          break
        case '.md':
          tree[propName] = converter.makeHtml(content)
          break
        default:
          tree[propName] = content
      }
    }
  }

  return tree
}

const relation = (types, item) => {
  const props = Object.keys(item)

  props.forEach(prop => {
    if (item[prop].contentType) {
      const type = camelCase(item[prop].contentType)
      const config = item[prop]

      if (isArray(config.items)) {
        item[prop] = pick(types[type], config.items)
      }

      if (config.items.qty && config.items.sortBy) {
        let items = toArray(types[type])
        items = sortBy(items, [config.items.sortBy])

        if (config.items.order === 'desc') {
          items = items.reverse()
        }

        item[prop] = items.splice(0, config.items.qty)
      }

    }
  })

  return item
}

module.exports = async () => {
  const content = await walk('content')

  Object.keys(content).forEach(lang => {
    Object.keys(content[lang].single).forEach(item => {
      content[lang].single[item] = relation(
        content[lang].type,
        content[lang].single[item]
      )
    })
  })

  return content
}
