import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db } from '../db'
import { validateSessionId } from '../middlewares/validate-session-id'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [validateSessionId] }, async (req, res) => {
    const { sessionId } = req.cookies

    const transactions = await db('transactions')
      .where('session_id', sessionId)
      .select('*')

    return res.status(200).send({ transactions })
  })

  app.get('/:id', { preHandler: [validateSessionId] }, async (req, res) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(req.params)

    const { sessionId } = req.cookies

    const transaction = await db('transactions')
      .where({ session_id: sessionId, id })
      .first()

    if (!transaction) {
      return res.status(404).send({ message: 'Transaction not found' })
    }

    return res.status(200).send({ transaction })
  })

  app.get('/summary', { preHandler: [validateSessionId] }, async (req, res) => {
    const { sessionId } = req.cookies

    const summary = await db('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'total' })
      .first()

    return res.status(200).send({ summary })
  })

  app.post('/create', async (req, res) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionSchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      res.cookie('sessionId', sessionId, {
        path: '/', // any route can access this cookie
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await db('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : -amount,
      session_id: sessionId,
    })

    return res.status(201).send({ message: 'Transaction created succesfuly' })
  })
}
