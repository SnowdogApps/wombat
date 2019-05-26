const { entity } = require('@snowdog/wombat')
const content = require('./wombat.db.json')
const config = require('./wombat.config.json')

module.exports = entity(content, config)
