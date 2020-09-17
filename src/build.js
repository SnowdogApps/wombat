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

  try {
    config = getConfig(config)
    const dbPath = path.resolve(config.dest)

    // Remove old database
    if (await fs.pathExists(dbPath)) {
      await fs.remove(dbPath)
    }

    if (!content) {
      content = await walk(config.src)
    }

    await fs.writeFile(dbPath, JSON.stringify(content), 'utf8')
  }
  catch(error) {
    console.error('Build failed :(', error)
    process.exit(1)
  }

  console.log('Build finished!')
  process.exit(0)
}
