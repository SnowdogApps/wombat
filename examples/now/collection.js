const { collection } = require('@snowdog/wombat')
const content = require('./db.json')
const config = require('./config.json')

module.exports = collection(content, config)
