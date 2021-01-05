const path = require('path')
const fs = require('fs-extra')
const camelCase = require('lodash.camelcase')
const showdown = require('showdown')
const converter = new showdown.Converter()
const getConfig = require('./get-config')

async function walk (dir) {
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
      const rawContent = fs.readFileSync(filePath, 'utf8')
      const extension = path.extname(filePath)

      switch(extension) {
        case '.json':
          tree[propName] = JSON.parse(rawContent)
          break
        case '.md':
          tree[propName] = converter.makeHtml(rawContent)
          break
      }
    }
  }

  return tree
}

function materializeUrl(content, url) {
  const string = JSON.stringify(content)
  const replaced = string.replace(/\{\{wombatUrl\}\}/g, url)
  return JSON.parse(replaced)
}

module.exports = async (config = {}, content) => {
  console.log('Building...')

  config = getConfig(config)
  const dbPath = path.resolve(config.dest)

  // Remove old database
  if (await fs.pathExists(dbPath)) {
    await fs.remove(dbPath)
  }

  if (!content) {
    content = await walk(config.src)
  }

  if (config.wombatUrl) {
    content = materializeUrl(content, config.wombatUrl)
  }

  await fs.writeFile(dbPath, JSON.stringify(content), 'utf8')

  console.log('Build finished!')
}
