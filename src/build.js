const path = require('path')
const fs = require('fs-extra')
const getContent = require('./get-content')

module.exports = async () => {
  const dbPath = path.resolve('./db.json')

  if (await fs.pathExists(dbPath)) {
    await fs.remove(dbPath)
  }

  const content = await getContent()
  await fs.writeFile(dbPath, JSON.stringify(content), 'utf8')
}
