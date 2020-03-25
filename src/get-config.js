const defaultsDeep = require('lodash.defaultsdeep')
const path = require('path')
const fs = require('fs')

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

const getConfig = () => {
  const localConfigPath = path.resolve('./wombat.config.json')

  let localConfig = {}
  if (fs.existsSync(localConfigPath)) {
    localConfig = require(localConfigPath)
  }

  return defaultsDeep(localConfig, defaults)
}

const config = getConfig()

module.exports = config
