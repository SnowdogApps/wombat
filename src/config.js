const path = require('path')
const fs = require('fs-extra')
const defaultsDeep = require('lodash.defaultsdeep')

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

module.exports = defaultsDeep(config, defaults)
