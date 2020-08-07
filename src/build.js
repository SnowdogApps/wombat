const path = require('path')
const fs = require('fs-extra')
const camelCase = require('lodash.camelcase')
const showdown = require('showdown')
const converter = new showdown.Converter()
const getConfig = require('./get-config')

const walk = async (dir, wombatUrl) => {
  dir = path.resolve(dir)
  const tree = {}
  const files = fs.readdirSync(dir)

  for (let file of files) {
    const filePath = path.join(dir, file)
    const fileName = path.basename(filePath)
    const propName = camelCase(fileName.replace(/\..*/, ''))
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      tree[propName] = await walk(filePath, wombatUrl)
    }

    if (stat.isFile()) {
      const rawContent = fs.readFileSync(filePath, 'utf8')
      const content = rawContent.replace(/\{\{wombatUrl\}\}/g, wombatUrl)
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

module.exports = async (config = {}, content) => {
  console.log('Building...')
  config = getConfig(config)
  const dbPath = path.resolve(config.dest)

  // Remove old database
  if (fs.pathExistsSync(dbPath)) {
    fs.removeSync(dbPath)
  }

  if (!content) {
    content = await walk(config.src, config.wombatUrl)
  }

  fs.writeFileSync(dbPath, JSON.stringify(content), 'utf8')

  console.log('Build finished!')
}
