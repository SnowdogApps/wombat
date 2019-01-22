const fs = require('fs-extra')
const path = require('path')

module.exports = () => {
  try {
    return JSON.parse(fs.readFileSync(path.resolve('./db.json'), 'utf8'))
  }
  catch(error) {
    throw new Error('You need to build db.json before trying to get content')
  }
}
