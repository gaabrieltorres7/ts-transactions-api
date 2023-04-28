import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(cookie)
app.register(transactionsRoutes, { prefix: 'transactions' }) // fastify-plugin

const start = async () => {
  try {
    await app.listen({ port: env.PORT }).then(() => {
      console.log('Server is running')
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
