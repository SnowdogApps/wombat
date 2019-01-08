const getCollection = require('../get-collection')
const content = require('../../db.json')

const lang = 'en'
const defaultQuery = {
  name: 'post'
}

describe('fetches a collection', () => {
  it('checks if getCollection function returns an array of collections', () => {
    const { items } = getCollection(content, lang, defaultQuery)
    expect(Array.isArray(items)).toBe(true)
  })

  it('checks the number of collections returned', () => {
    const query = {
      ...defaultQuery,
      limit: 3
    }
    const { items } = getCollection(content, lang, query)
    expect(items.length).toBe(3)
  })

  it('checks that collections are sorted by asc order', () => {
    const query = {
      ...defaultQuery,
      sortBy: "content.title",
      sort: "asc"
    }
    const { items } = getCollection(content, lang, query)
    expect(items[0].content.title).toBe('Tech newsletters vs lack of time')
  })

  it('checks that collections are sorted in default order (desc)', () => {
    const { items } = getCollection(content, lang, defaultQuery)
    expect(items[0].content.title).toBe('Front-end news summary #1')
  })

  it('checks collection pagination works', () => {
    const query = {
      ...defaultQuery,
      perPage: 1,
      page: 1
    }
    const { items } = getCollection(content, lang, query)
    expect(items.length).toBe(1)
  })

  it('checks if collection pagination is an object', () => {
    const query = {
      ...defaultQuery,
      perPage: 2,
      page: 1
    }

    const pagination = {
      total: 6,
      totalPages: 3
    }
    const collection = getCollection(content, lang, query)
    expect(typeof collection.pagination).toBe('object')
    expect(collection.pagination).toEqual(expect.objectContaining(pagination))
  })

  it('checks collection props', () => {
    const query = {
      ...defaultQuery,
      props: ["content.author", "id"]
    }
    const { items } = getCollection(content, lang, query)
    expect(Array.isArray(items)).toBe(true)
    expect(items).not.toBe(null)
  })
})
