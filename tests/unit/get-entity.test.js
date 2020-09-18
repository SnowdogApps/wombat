const getEntity = require('../../src/get-entity')
const content = require('../mocks/wombat.db.json')

const lang = 'en'
const name = 'home'

describe('Entity', () => {
  const entity = getEntity(content, lang, name)

  it('checks if entity is an object', () => {
    expect(typeof entity).toBe('object')
  })

  it('checks if {{wombatUrl}} is replaced with real URL', () => {
    expect(entity.meta['og:image']).toBe('http://api.your.app/images/social.png')
  })
})
