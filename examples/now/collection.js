const content = require('./db.json')
const collection = require('@snowdog/wombat/serverless/collection')

module.exports = collection(content)
