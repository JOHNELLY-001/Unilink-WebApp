import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = neon(process.env.DATABASE_URL)

async function migrate() {
  console.log('🔄 Running migrations...')

  const migrationsDir = join(__dirname, 'migrations')
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const filePath = join(migrationsDir, file)
    const sqlText  = readFileSync(filePath, 'utf-8')
    console.log(`  ▶ Running: ${file}`)
    await sql.unsafe(sqlText)
    console.log(`  ✅ Done:    ${file}`)
  }

  console.log('\n✅ All migrations complete.')
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})