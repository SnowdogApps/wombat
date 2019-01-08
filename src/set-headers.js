const config = require('./config')

module.exports = (request, response, isDev = false) => {
  const origin = request.headers.origin
  let allowedOrigins = []

  if (config.allowedOrigins) {
    allowedOrigins = config.allowedOrigins
  }
  
  if(isDev)
  {
    response.setHeader('Access-Control-Allow-Origin', '*')
  }
  else if(allowedOrigins.indexOf(origin) > -1) {
    response.setHeader('Access-Control-Allow-Origin', origin)
  }

  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  response.setHeader('Access-Control-Expose-Headers', 'X-Wombat-Total, X-Wombat-TotalPages')
  response.setHeader('Access-Control-Max-Age', 2592000)
}