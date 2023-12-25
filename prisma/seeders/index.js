/* eslint-disable no-trailing-spaces */
/* eslint-disable comma-dangle */
const { PrismaClient } = require('@prisma/client')
const { randomUUID } = require('crypto')
const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')

const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

const readFile = async (path) => {
  const file = await fs.readFile(path, 'utf-8')

  if (!file) {
    throw new Error('Error while reading file')
  }

  return JSON.parse(file)
}

const seederGenerate = async (table, data) => {
  try {
    await prismaClient[table].create({ data })
  } catch (error) {
    throw new Error(error)
  } finally {
    await prismaClient.$disconnect()
  }
}

const hashGenerator = (obj) => {
  const hash = crypto.createHash('sha256')

  hash.update(JSON.stringify(obj))
  return hash.digest('hex')
}

const getSeedersByTable = async (table) => {
  const seeders = await prismaClient.executedSeeders.findMany({ where: { table } })
  return seeders ?? null
}

const createExecutedSeeder = async (table, hash) => {
  await prismaClient.executedSeeders.create({
    data: {
      id: randomUUID(),
      table,
      hash,
      executedAt: new Date()
    }
  })    
}

const main = async () => {    
  const json = await readFile(path.join(__dirname, 'data.json'))
  const tables = Object.keys(json.tables)

  if (!tables) {
    return
  }

  for (const table of tables) {
    const data = json.tables[table].data

    if (!data) {
      return
    }

    const hashes = []
    const seeders = await getSeedersByTable(table)

    seeders.map((seed) => hashes.push(seed.hash))

    for (const obj of data) {
      const newDataHash = hashGenerator(obj)

      if (!hashes.includes(newDataHash)) {
        await seederGenerate(table, obj)
        await createExecutedSeeder(table, newDataHash)
      }
    }
  }
}

main()
