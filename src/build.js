const path = require('path')
const fs = require('fs-extra')
const getContent = require('./get-content')

module.exports = async () => {
  const dbPath = path.resolve('./db.json')
  const content = JSON.stringify(getContent())
  await fs.writeFile(dbPath, content, 'utf8')
}
