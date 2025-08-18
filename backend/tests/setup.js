// backend/tests/setup.js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

/** Start an in-memory Mongo and connect mongoose (shared default connection). */
export async function setupDB() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}

/** Wipe all collections between tests. */
export async function cleanupDB() {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

/** Disconnect and stop in-memory server. */
export async function teardownDB() {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
}
