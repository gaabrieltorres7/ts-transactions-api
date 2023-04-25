import dotenv from 'dotenv'
import fastify from 'fastify'

dotenv.config()

const app = fastify()

app.get('/', async (request, reply) => {
  return { message: 'Testing...' }
})

const start = async () => {
  try {
    await app.listen({ port: 3000 }).then(() => {
      console.log('Server is running')
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
