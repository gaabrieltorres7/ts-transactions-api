import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db } from '../db'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async (req, res) => {
    const transactions = await db('transactions').select('*')
    return res.status(200).send({ transactions })
  })

  app.get('/:id', async (req, res) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(req.params)

    const transaction = await db('transactions').where({ id }).first()

    if (!transaction) {
      return res.status(404).send({ message: 'Transaction not found' })
    }

    return res.status(200).send({ transaction })
  })

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
