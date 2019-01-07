const fs = require('fs-extra')
const path = require('path')
const camelCase = require('lodash/camelCase')
const showdown = require('showdown')
const converter = new showdown.Converter()

const walk = async dir => {
  dir = path.resolve(dir)
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
      }
    }
  }

  return tree
}

module.exports = async () => {
  const dbPath = path.resolve('./db.json')

  if (await fs.pathExists(dbPath)) {
    return JSON.parse(await fs.readFile(dbPath, 'utf8'))
  }

  return await walk('./content')
}
