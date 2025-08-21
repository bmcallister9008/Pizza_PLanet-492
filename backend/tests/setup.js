// backend/tests/setup.js
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod

export async function setupDB() {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoose.connect(uri)
}

export async function teardownDB() {
  await mongoose.connection.dropDatabase().catch(() => {})
  await mongoose.connection.close().catch(() => {})
  if (mongod) await mongod.stop()
}

beforeAll(async () => {
  await setupDB()
})

afterAll(async () => {
  await teardownDB()
})

afterEach(async () => {
  const { collections } = mongoose.connection
  for (const name of Object.keys(collections)) {
    await collections[name].deleteMany({})
  }
})
