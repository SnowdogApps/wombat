# Wombat
### Flat file, headless CMS for building configurable API
Simple open-source self-hosted Content Management Framework (headless-CMS) to powerful API with no effort.

## Features
- **Simple** - Designed to replace Wordpress in building simple company / product / event pages
- **Fast** - Build on top of Express.js and flat files
- **Lightweight** - Just 5 dependencies, no database or other system-wide requirements
- **Two types of data** - Unlike Contentful or Strapi, offers not only items collection but also single entities like pages or configs
- **Full internationalization** - Every piece content is assigned to one language, so you have complete freedom in customizing it
- **No strict schema** - Do you need each item within a content type to do be different and have a different structure for each language? No problem, sky is the limit!
- **No Admin Panel** - You are not limited by the UI or poor UX, just you and bunch of JSON and Markdown files
- **Front-end agnostic** - Simple REST API can be used by any application

## Setup
1. Create a new directory and initialize a JS project using `yarn init`
2. Add Wombat as a dependency `yarn add @snowdog/wombat`
3. Add a `script` in `package.json` to run Wombat
   ```json
    "scripts": {
      "start": "wombat"
    },
   ```
4. Create `/content/[languages]/(single|type)` and `/public` directories
5. (Optional) Create `conifg.json` file
6. Run `yarn start` to turn on the Wombat!

## Config options
* `defaultLang` (default `en`) - Fallback language when request is send without `lang` query param
* `port` (default `3000`) - Port used by the web server to listen for requests

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
Created to keep a single object like a landing page content or global configuration object.
- Entities are stored in `entity` directory inside each language.
- Each entity needs to be added as a directory.
- Every property of entity needs to be a separate JSON or Markdown file.
- You can define the relation between entity and collection

### How to define a relation between entity and collection
Create new prop JSON file with relation config:
```js
{
  "collectionName": "collectionName", // required
  "filter": {
    "items": ["award", "about", "partner"], // (optional)
    "sortBy": "title", // (optional) if defined collection is returned as array
    "sort": "asc", // (optional) `desc` is default - `sortBy` required to use it
    "limit": 2 // (optional) - `sortBy` required to use it
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
### `/entity/{name}`
Retrieve an entity item

**Example:**
To get `home` send request to `/entity/home`

**URL params:**
- `lang` - return content in given lang

### `/collection/{name}`
Retrieve the whole collection as object

**Example:**
To get `blog` send request to `/collection/blog`

**URL params:**
- `lang` - return content in given lang
- `items` - list of coma separated IDs of collection items
- `sortBy` - Prop name used to sort collection. Collection will be returned as array.
- `sort` - Can be set to `asc`. `sortBy` required to use it.
- `limit` - Limit numer or returned collection items. `sortBy` required to use it.
