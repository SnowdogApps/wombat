#!/usr/bin/env node
const wombat = require('../index')
const task = process.argv.slice(2)[0] || 'start'

switch(task) {
  case 'start':
    wombat.start()
    break
  case 'build':
    wombat.build()
    break
  default:
    throw new Error('Unknown option. Only `start` and `build` are supported.')
}
