import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL in .env.local');
  process.exit(1);
}

async function runMigration() {
  console.log('🚀 Running database migration...\n');

  const sql = postgres(databaseUrl, { prepare: false });

  try {
    // Read the Drizzle-generated migration SQL file
    const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '0000_cheerful_devos.sql');
    const migrationSql = readFileSync(sqlPath, 'utf-8');

    // Split by Drizzle's statement-breakpoint comments
    const statements = migrationSql
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement individually
    let created = 0;
    let skipped = 0;

    for (const statement of statements) {
      try {
        await sql.unsafe(statement);
        created++;
        console.log(`✅ Statement ${created + skipped}/${statements.length}`);
      } catch (error) {
        // Skip if table/type already exists
        if (error.code === '42P07' || error.code === '42710') {
          skipped++;
          console.log(`⏭️  Statement ${created + skipped}/${statements.length} (already exists)`);
        } else if (error.code === '23503') {
          // Foreign key violation - skip constraint (might be caused by existing data)
          skipped++;
          console.log(`⏭️  Statement ${created + skipped}/${statements.length} (constraint skipped)`);
        } else {
          throw error; // Re-throw unexpected errors
        }
      }
    }

    console.log(`\n✅ Migration completed!`);
    console.log(`📊 Created: ${created}, Skipped: ${skipped}, Total: ${statements.length}\n`);
    
    await sql.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    await sql.end();
    process.exit(1);
  }
}

runMigration();
