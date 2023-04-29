import { beforeAll, beforeEach, afterAll, describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:lastest')
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

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions/create')
      .send({
        title: 'Test transaction',
        amount: 500,
        type: 'credit',
      })

    const cookies = createTransactionResponse.headers['set-cookie']

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Test transaction',
        amount: 500,
      }),
    ])
  })
})
