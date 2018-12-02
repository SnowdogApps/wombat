const content = require('./db.json')
const entity = require('@snowdog/wombat/serverless/now/entity')

module.exports = entity(content)
