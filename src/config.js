const fs = require('fs-extra')

const path = require('path')
const configPath = path.resolve('./config.json')

let config = {}

if (fs.existsSync(configPath)) {
  config = require(configPath)
}

const defaults = {
  defaultLang: 'en',
  allowedOrigins: [],
  dev: {
    port: 3000,
    build: true
  }
}

module.exports = Object.assign({}, defaults, config)
