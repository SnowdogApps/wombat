<p align="center">
  <img src="./assets/logo.svg" height="200">
</p>

# Wombat
Simple open-source flat-file serverless Content Management Framework (headless-CMS) to build powerful API effortlessly.

## Features
- **Simple** - Designed to replace Wordpress in building simple company / product / event pages
- **Fast and lightweight** - Serverless oriented, no framework, no database or other system-wide requirements
- **Two types of data** - Unlike Contentful or Strapi, offers not only items collection, but also single entities, that can be used to build pages or store configuration
- **Full internationalization** - Every piece content is assigned to one language, so you have complete freedom in customizing it
- **No strict schema** - Do you need each item within a content type to do be different and have a different structure for each language? No problem, sky is the limit!
- **No Admin Panel** - You are not limited by the UI or poor UX, just you and bunch of JSON and Markdown files
- **Front-end agnostic** - Simple REST API can be used by any application


## Setup
1. Add Wombat as dependecy `yarn add @snowdog/wombat`
2. Create content following [Content structure](#content-structure) description.
2. Add `"dev": "wombat dev"` to `package.json` scripts section
3. Run `yarn dev` and enjoy working with your new API

## Serverless deployment
This guide is for [ZEIT Now](https://zeit.co/docs/v2/deployments/official-builders/node-js-now-node/), but setting up any other serverless env looks simillar.

1. In `package.json` add automatic DB building after installing dependecies
   ```
    "scripts": {
      "postinstall": "wombat build",
      "dev": "wombat dev"
    }
   ```
2. Define new builds and routes in `now.json` acording to [the example](./examples/now/now.json)
3. Copy [collection.js](./examples/now/collection.js) and [entity.js](./examples/now/entity.js) from examples
4. Deploy your app via `now`

## Config options
* `defaultLang` (default `en`) - Fallback language when request is send without `lang` query param.
* `port` (default `3000`, only for development purpouses) Port used by the web server to listen for requests.

## Content structure
All content is kept in `/content` directory.
Inside you need to define supported languages. For example, we want to have content just in English, so it will be `/content/en`.

Wombat supports two data types:
### Collections
Designed to store sets of similar data, like blog posts, authors, job offers etc.
- Collections are stored in `collection` directory inside each language.
- Each collection and item of collection needs to be added as a directory.
- Every property of an item collection needs to be a separate JSON or Markdown file.

### Entities
Created to keep a single object like a landing page content or global configuration.
- Entities are stored in `entity` directory inside each language.
- Each entity needs to be added as a directory.
- Every property of entity needs to be a separate JSON or Markdown file.
- You can define the relation between entity and collection.

### How to define a relation between entity and collection?
Create new JSON file inside entity directory to define relation:
```js
{
  "query": {
    "name": "collectionName", // (required) collection name
    "sortBy": "title", // prop name used for sorting
    "sort": "desc", // `asc` is default - `sortBy` required to use it
    "limit": 2, // limit numer of returned items
    "page": 1, // page number
    "perPage": 100, // numer of items per page
    "items": ["award", "about", "partner"], // Array of collection items IDs. Items order is preserved.
    "props": ["id", "content"] // return only selected object props
  }
}
```

### Example content tree
```
content
└── en
    ├── collection
    |   └── blog
    |       └── why-wombat-poop-is-cube
    |       |   ├── content.md
    |       |   ├── featured-image.json
    |       |   └── title.json
    |       └── things-you-dont-know-about-wombats
    |           ├── content.md
    |           ├── featured-image.json
    |           ├── form-config.json
    |           └── title.json
    └── entity
        └── home
            ├── blog-posts.json
            ├── about.md
            └── hero-banner.json
```
## API
### `/entity`
Retrieve an entity item.

**Example:**
To get `home` entity send request to `/entity?name=home`.

**URL params:**
- `name` - (required) Name of entity
- `lang` - Return content in given lang.

### `/collection`
Retrieve the whole collection as array.

**Examples:**
#### Whole collection
```
/collection?name=blog
```

#### Whole collection, but only title and content
```
/collection?name=blog&props=title,title
```

#### Only items selected by ID
```
/collection?name=blog&items=why-wombat-poop-is-cube,things-you-dont-know-about-wombats
```

#### Two items from collection sorted by title descending
```
/collection?name=blog&limit=2&sortBy=title&sort=desc
```

#### Items from second page, up to five per page
```
/collection?name=blog&page=2&perPage=5
```

**URL params:**
- `name` - (required) Name of collection.
- `lang` - Return content in given lang.
- `sortBy` - Prop name used for sorting.
- `sort` - `asc` is default - `sortBy` required to use it.
- `limit` - Limit numer of returned items.
- `page` - Page number.
- `perPage` - Numer of items per page.
- `items` - Comma separated list of collection items IDs. Items order is preserved.
- `props` - Comma separated list of selected object props, GraphQL-like.
