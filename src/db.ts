import dotenv from 'dotenv'
import { knex, Knex } from 'knex'

dotenv.config()

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: process.env.DB_URL ?? '',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const db = knex(config)
