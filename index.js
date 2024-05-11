import FastifySwagger from '@fastify/swagger'
import Fastify from 'fastify'
import ScalarApiReference from '@scalar/fastify-api-reference'

// Instantiate the framework
const fastify = Fastify({
  logger: true,
})


// Set up @fastify/swagger
await fastify.register(FastifySwagger, {
  openapi: {
    info: {
      title: 'My Fastify App',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
  },
})

fastify.put(
  '/example-route/:id',
  {
    schema: {
      description: 'post some data',
      tags: ['user', 'code'],
      summary: 'qwerty',
      security: [{ apiKey: [] }],
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'user id',
          },
        },
      },
      body: {
        type: 'object',
        properties: {
          hello: { type: 'string' },
          obj: {
            type: 'object',
            properties: {
              some: { type: 'string' },
            },
          },
        },
      },
      response: {
        201: {
          description: 'Succesful response',
          type: 'object',
          properties: {
            hello: { type: 'string' },
          },
        },
        default: {
          description: 'Default response',
          type: 'object',
          properties: {
            foo: { type: 'string' },
          },
        },
      },
    },
  },
  (req, reply) => {
    reply.send({ hello: `Hello ${req.body.hello}` })
  },
)

// Serve an OpenAPI file
fastify.get('/openapi.json', async (request, reply) => {
  return fastify.swagger()
})

await fastify.register(ScalarApiReference, {
  routePrefix: '/reference',
  configuration: {
    title: 'Our API Reference',
    spec: {
    url: '/openapi.json',
    },
    },
})

// Wait for Fastify
await fastify.ready()

// Run the server
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  console.log(`Fastify is now listening on ${address}`)
})