#!/usr/bin/env node
const build = require('../src/build')
const dev = require('../src/dev')
const task = process.argv.slice(2)[0] || 'build'

;(async () => {
  switch(task) {
    case 'dev':
      await dev()
      break
    case 'build':
      await build()
      break
    default:
      throw new Error('Unknown option. Only `dev` and `build` are supported.')
  }
})()
