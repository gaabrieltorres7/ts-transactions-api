import { expect, beforeAll, afterAll, describe, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server)
      .post('/transactions/create')
      .send({
        title: 'Test transaction',
        amount: 500,
        type: 'credit',
      })

    expect(response.statusCode).toBe(201)
  })
})
