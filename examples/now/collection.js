const content = require('./db.json')
const collection = require('@snowdog/wombat/serverless/now/collection')

module.exports = collection(content)
