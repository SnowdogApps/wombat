const path = require('path')
const fs = require('fs-extra')
const camelCase = require('lodash.camelcase')
const showdown = require('showdown')
const config = require('./get-config')

let converter

const walk = async dir => {
  dir = path.resolve(dir)
  const tree = {}
  const files = fs.readdirSync(dir)

  for (let file of files) {
    const filePath = path.join(dir, file)
    const fileName = path.basename(filePath)
    const propName = camelCase(fileName.replace(/\..*/, ''))
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      tree[propName] = await walk(filePath)
    }

    if (stat.isFile()) {
      const content = fs.readFileSync(filePath, 'utf8')
      const extension = path.extname(filePath)

      switch (extension) {
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

module.exports = async content => {
  console.log('Building...')

  const dbPath = path.resolve(config.dest)

  // Remove old database
  if (fs.pathExistsSync(dbPath)) {
    fs.removeSync(dbPath)
  }

  converter = new showdown.Converter({
    ...config.showdownOptions
  })

  if (!content) {
    content = await walk(config.src)
  }

  fs.writeFileSync(dbPath, JSON.stringify(content), 'utf8')

  console.log('Build finished!')
}
