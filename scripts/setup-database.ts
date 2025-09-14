import { createAdminClient } from '../lib/supabase/server'
import fs from 'fs'
import path from 'path'

const supabase = createAdminClient()

async function setupDatabase() {
  try {
    console.log('🔧 Setting up DMFL database...')

    // Read and execute migrations in order
    const migrationsDir = path.join(process.cwd(), 'db', 'migrations')
    const migrationFiles = [
      '001_initial_schema.sql',
      '002_create_views.sql',
      '003_rls_policies.sql'
    ]

    for (const file of migrationFiles) {
      console.log(`\n📄 Running ${file}...`)
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      
      // Split SQL by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
          if (error && !error.message.includes('already exists')) {
            console.warn(`Warning in ${file}:`, error.message)
          }
        } catch (err) {
          console.warn(`Warning executing statement:`, err)
        }
      }
      
      console.log(`✅ Completed ${file}`)
    }

    console.log('\n🎉 Database setup completed!')
    console.log('\nNext steps:')
    console.log('1. Run: pnpm run seed')
    console.log('2. Run: pnpm run dev')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  setupDatabase()
}