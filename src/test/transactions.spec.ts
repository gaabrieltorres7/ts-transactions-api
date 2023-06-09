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
    execSync('npm run knex migrate:latest')
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

  it('should be able to get a specific transaction', async () => {
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

    const transactionId = response.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    const expectedTransaction = expect.objectContaining({
      title: 'Test transaction',
      amount: 500,
    })

    expect(getTransactionResponse.body.transaction).toEqual(expectedTransaction)
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions/create')
      .send({
        title: 'Credit transaction',
        amount: 500,
        type: 'credit',
      })

    const cookies = createTransactionResponse.headers['set-cookie']

    await request(app.server)
      .post('/transactions/create')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 200,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    const expectedSummary = expect.objectContaining({
      total: 300,
    })

    expect(summaryResponse.body.summary).toEqual(expectedSummary)
  })
})
