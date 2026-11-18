import 'dotenv/config'

const required = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'GOOGLE_CLIENT_ID',
  'CLIENT_URL',
]

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export const env = {
  NODE_ENV:               process.env.NODE_ENV || 'development',
  PORT:                   parseInt(process.env.PORT) || 5000,
  DATABASE_URL:           process.env.DATABASE_URL,
  JWT_ACCESS_SECRET:      process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET:     process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES:     process.env.JWT_ACCESS_EXPIRES  || '15m',
  JWT_REFRESH_EXPIRES:    process.env.JWT_REFRESH_EXPIRES || '7d',
  CLOUDINARY_CLOUD_NAME:  process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY:     process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET:  process.env.CLOUDINARY_API_SECRET,
  GOOGLE_CLIENT_ID:       process.env.GOOGLE_CLIENT_ID,
  CLIENT_URL:             process.env.CLIENT_URL,
}