const Hapi = require('hapi')

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  })

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);

  return server
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
})

module.exports = init
