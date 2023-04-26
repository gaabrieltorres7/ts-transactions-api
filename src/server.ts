import dotenv from 'dotenv'
import fastify from 'fastify'
import { db } from './db'

dotenv.config()

const app = fastify()

app.get('/', async (request, reply) => {
  const transactions = await db('transactions')
    .where('amount', 1000)
    .select('*')

  return transactions
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
