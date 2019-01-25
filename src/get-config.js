const defaultsDeep = require('lodash.defaultsdeep')

const defaults = {
  defaultLang: 'en',
  allowedOrigins: [],
  dev: {
    port: 3000,
    build: true
  }
}

module.exports = (config = {}) => {
  return defaultsDeep(config, defaults)
}

