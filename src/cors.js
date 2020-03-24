const config = require("./get-config");

module.exports = (request, response, isDev = false) => {
  const origin = request.headers.origin;
  const allowedOrigins = config.allowedOrigins.map(url => {
    const urlPattern = new RegExp(url.replace("*", ".+"));
    return urlPattern.test(origin) ? origin : url;
  });

  if (isDev) {
    response.setHeader("Access-Control-Allow-Origin", "*");
  } else if (allowedOrigins.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
  }

  response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  response.setHeader(
    "Access-Control-Expose-Headers",
    "X-Wombat-Total, X-Wombat-TotalPages"
  );
  response.setHeader("Access-Control-Max-Age", 2592000);

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }
};
