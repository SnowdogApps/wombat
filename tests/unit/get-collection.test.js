const getCollection = require('../../src/get-collection')
const content = require('../../wombat.db.json')

const lang = 'en'
const defaultQuery = {
  name: 'home-about'
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

  it('checks that collections are sorted in default order (desc)', () => {
    const query = {
      ...defaultQuery,
      sortBy: 'title'
    }

    const { items } = getCollection(content, lang, query)
    expect(items[0].title).toBe('Aaa')
  })

  it('checks that collections are sorted by desc order', () => {
    const query = {
      ...defaultQuery,
      sortBy: 'title',
      sort: 'desc'
    }

    const { items } = getCollection(content, lang, query)
    expect(items[0].title).toBe('Ccc')
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
      total: 3,
      totalPages: 2
    }
    const collection = getCollection(content, lang, query)
    expect(typeof collection.pagination).toBe('object')
    expect(collection.pagination).toEqual(expect.objectContaining(pagination))
  })

  it('checks collection props', () => {
    const query = {
      ...defaultQuery,
      props: ['content.author', 'id']
    }
    const { items } = getCollection(content, lang, query)
    expect(Array.isArray(items)).toBe(true)
    expect(items).not.toBe(null)
  })

  it('get items with dates in range', () => {
    // Dates range
    expect(
      getCollection(content, lang, {
        name: 'posts',
        filter: {
          type: 'date',
          prop: 'date',
          from: '2019-03-09',
          to: '2019-03-11'
        }
      }).items.length
    ).toBe(1)

    // Up to date
    expect(
      getCollection(content, lang, {
        name: 'posts',
        filter: {
          type: 'date',
          prop: 'date',
          to: '2019-03-11'
        }
      }).items.length
    ).toBe(2)

    // From date
    expect(() =>
      getCollection(content, lang, {
        name: 'posts',
        filter: {
          type: 'date',
          prop: 'date',
          from: '2019-03-15'
        }
      })
    ).toThrowError(new Error('You need to define dates range'))

    // Empty
    expect(
      getCollection(content, lang, {
        name: 'posts',
        filter: {
          type: 'date',
          prop: 'date',
          from: '2019-05-09',
          to: '2019-05-11'
        }
      }).items.length
    ).toBe(0)
  })

  it('get items with numbers in range', () => {
    // Numbers range
    expect(
      getCollection(content, lang, {
        name: 'posts',
        filter: {
          type: 'number',
          prop: 'commentsCount',
          from: '20',
          to: '30'
        }
      }).items.length
    ).toBe(1)

    // Numbers up to
    expect(
      getCollection(content, lang, {
        name: 'posts',
        filter: {
          type: 'number',
          prop: 'commentsCount',
          to: '30'
        }
      }).items.length
    ).toBe(1)

    // Numbers starting from
    expect(
      getCollection(content, lang, {
        name: 'posts',
        filter: {
          type: 'number',
          prop: 'commentsCount',
          from: '30'
        }
      }).items.length
    ).toBe(2)
  })
})
