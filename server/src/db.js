import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
dotenv.config()

// Neon HTTP driver — uses port 443 (HTTPS) instead of port 5432
// This is required when port 5432 is blocked by firewall or network policy
const sql = neon(process.env.DATABASE_URL)

export default sql