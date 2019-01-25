const { entity } = require('@snowdog/wombat')
const content = require('./db.json')
const config = require('./config.json')

module.exports = entity(content, config)
