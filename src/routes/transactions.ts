import { FastifyInstance } from 'fastify'
import { db } from '../db'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await db('transactions')
      .where('amount', 1000)
      .select('*')

    return transactions
  })
}
