const { entity } = require('@snowdog/wombat')
const content = require('./db.json')

module.exports = entity(content)
