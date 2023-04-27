import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db } from '../db'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/create', async (req, res) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionSchema.parse(req.body)

    await db('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : -amount,
    })

    return res.status(201).send({ message: 'Transaction created succesfuly' })
  })
}
