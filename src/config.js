const fs = require('fs-extra')

const path = require('path')
const configPath = path.resolve('./config.json')

let config = {}

if (fs.existsSync(configPath)) {
  config = require(configPath)
}

const defaults = {
  defaultLang: 'en',
  port: 3000
}

module.exports = Object.assign({}, defaults, config)
