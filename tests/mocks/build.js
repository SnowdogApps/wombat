const path = require('path')
const build = require('../../src/build')

;(async () => {
  const src = path.join(__dirname, 'content')
  const dest = path.join(__dirname, 'wombat.db.json')
  const wombatUrl = 'http://api.your.app'
  await build({ src, dest, wombatUrl })
})()
