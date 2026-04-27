import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB  = process.env.MONGODB_DB || 'ariosetech'

let client: MongoClient
let db: Db

async function connectDB(): Promise<Db> {
  if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable is not set. Please create a .env.local file.')
  if (db) return db

  if (process.env.NODE_ENV !== 'production' && (global as { _mongoClient?: MongoClient })._mongoClient) {
    client = (global as { _mongoClient?: MongoClient })._mongoClient!
  } else {
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    await client.connect()
    if (process.env.NODE_ENV !== 'production') {
      (global as { _mongoClient?: MongoClient })._mongoClient = client
    }
  }

  db = client.db(MONGODB_DB)

  await db.collection('pages').createIndex({ fullPath: 1 }, { unique: true, sparse: true })
  await db.collection('pages').createIndex({ slug: 1 })
  await db.collection('page_versions').createIndex({ pageId: 1 })
  await db.collection('blogs').createIndex({ slug: 1 }, { unique: true })
  await db.collection('blogs').createIndex({ published: 1 })
  await db.collection('portfolio').createIndex({ slug: 1 }, { unique: true })
  await db.collection('media').createIndex({ key: 1 })

  return db
}

export default connectDB

export async function getCollection<T extends object>(name: string) {
  const database = await connectDB()
  return database.collection<T>(name)
}
