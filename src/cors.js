module.exports = (request, response, config, isDev = false) => {
  const origin = request.headers.origin
  const getWildCards = (val) => {
    if (val.includes('*')) {
      const url = val.replace('*', '(.+)')
      const urlPattern = new RegExp(url)

      return urlPattern.test(origin) ? origin : val
    }
    return val
  }
  const allowedOrigins = config.allowedOrigins.map(getWildCards)

  if (isDev) {
    response.setHeader('Access-Control-Allow-Origin', '*')
  }
  else if (allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin)
  }

  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  response.setHeader('Access-Control-Expose-Headers', 'X-Wombat-Total, X-Wombat-TotalPages')
  response.setHeader('Access-Control-Max-Age', 2592000)

  if (request.method === 'OPTIONS') {
    response.statusCode = 204
    response.end()
    return
  }
}
