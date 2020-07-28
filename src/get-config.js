const path = require('path')
const fs = require('fs-extra')
const defaultsDeep = require('lodash.defaultsdeep')
const localConfigPath = path.resolve('./wombat.config.json')

const defaults = {
  defaultLang: 'en',
  allowedOrigins: [],
  src: './content',
  dest: './wombat.db.json',
  dev: {
    port: 3000,
    build: true
  }
}

let localConfig = {}
if (fs.existsSync(localConfigPath)) {
  localConfig = require(localConfigPath)
}

const mergedConfig = defaultsDeep(localConfig, defaults)

module.exports = (config = {}) => {
  return defaultsDeep(config, mergedConfig)
}
