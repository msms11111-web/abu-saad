import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'
import User from './models/User.js'
import { runSeed } from './utils/seedData.js'

dotenv.config()

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saudi-essence')
    console.log('✅ Database connected')

    await Product.deleteMany({})
    await User.deleteMany({})
    console.log('🗑️ Cleared existing data')

    const result = await runSeed()
    console.log(`✅ ${result.products} products and ${result.users} users created`)

    console.log('✅ Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

seedDatabase()
