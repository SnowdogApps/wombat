const { collection } = require('@snowdog/wombat')
const content = require('./db.json')

module.exports = collection(content)
