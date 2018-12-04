#!/usr/bin/env node
const wombat = require('../index')
const task = process.argv.slice(2)[0] || 'dev'

switch(task) {
  case 'dev':
    wombat.dev()
    break
  case 'build':
    wombat.build()
    break
  default:
    throw new Error('Unknown option. Only `dev` and `build` are supported.')
}
