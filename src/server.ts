import fastify from 'fastify'
import { db } from './db'
import { env } from './env'

const app = fastify()

app.get('/', async (request, reply) => {
  const transactions = await db('transactions')
    .where('amount', 1000)
    .select('*')

  return transactions
})

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
