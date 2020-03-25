const getEntity = require('../../src/get-entity')
const content = require('../../wombat.db.json')

const lang = 'en'
const name = 'home'

describe('fetches an entity', () => {
  const entity = getEntity(content, lang, name)
  it('checks if entity is an object', () => {
    expect(typeof entity).toBe('object')
  })
})
