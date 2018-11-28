const fs = require('fs-extra')

const path = require('path')
const configPath = path.resolve('./config.json')

let config = {}

if (fs.existsSync(configPath)) {
  config = require(configPath)
}

const defaults = {
  langs: ['en'],
  defaultLang: 'en'
}

module.exports = Object.assign({}, defaults, config)
