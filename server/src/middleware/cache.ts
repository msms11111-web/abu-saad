import { Request, Response, NextFunction } from 'express'
import redis from 'redis'

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

client.on('error', (err) => console.log('Redis Client Error', err))
client.connect()

// Cache middleware
export const cacheMiddleware = (duration: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next()
    }

    const key = `cache:${req.originalUrl}`

    try {
      const cachedData = await client.get(key)
      if (cachedData) {
        res.set('X-Cache', 'HIT')
        return res.json(JSON.parse(cachedData))
      }

      res.set('X-Cache', 'MISS')

      // Override res.json to cache the response
      const originalJson = res.json.bind(res)
      res.json = function (data: any) {
        client.setEx(key, duration, JSON.stringify(data)).catch(console.error)
        return originalJson(data)
      }

      next()
    } catch (error) {
      console.error('Cache error:', error)
      next()
    }
  }
}

// Clear cache
export const clearCache = async (pattern: string) => {
  try {
    const keys = await client.keys(`cache:${pattern}*`)
    if (keys.length > 0) {
      await client.del(keys)
    }
  } catch (error) {
    console.error('Clear cache error:', error)
  }
}

// Cache invalidation helper
export const invalidateCache = (paths: string[]) => {
  return paths.forEach(path => clearCache(path))
}
