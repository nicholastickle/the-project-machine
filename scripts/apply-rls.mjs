import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL in .env.local');
  process.exit(1);
}

async function applyRLS() {
  console.log('🔐 Applying Row Level Security policies...\n');

  const sql = postgres(databaseUrl, { prepare: false });

  try {
    const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '0001_rls_policies.sql');
    const rlsSql = readFileSync(sqlPath, 'utf-8');

    // Remove comments
    const cleanSql = rlsSql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    // Split more intelligently - look for semicolons not inside $$ blocks
    const statements = [];
    let currentStatement = '';
    let inDollarQuote = false;

    for (let i = 0; i < cleanSql.length; i++) {
      const char = cleanSql[i];
      const next = cleanSql[i + 1];

      currentStatement += char;

      // Check for $$ delimiter
      if (char === '$' && next === '$') {
        inDollarQuote = !inDollarQuote;
        currentStatement += next;
        i++; // Skip next $
        continue;
      }

      // Split on semicolon only if not in dollar quote
      if (char === ';' && !inDollarQuote) {
        const trimmed = currentStatement.trim();
        if (trimmed.length > 0) {
          statements.push(trimmed);
        }
        currentStatement = '';
      }
    }

    console.log(`📝 Found ${statements.length} RLS statements to execute\n`);

    let applied = 0;
    let skipped = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        await sql.unsafe(statement);
        applied++;
        console.log(`✅ Statement ${applied + skipped}/${statements.length}`);
      } catch (error) {
        // Skip if policy/function already exists
        if (error.code === '42710' || error.code === '42723') {
          skipped++;
          console.log(`⏭️  Statement ${applied + skipped}/${statements.length} (already exists)`);
        } else {
          console.error(`\n❌ Error on statement ${applied + skipped + 1}:`);
          console.error(statement.substring(0, 100) + '...');
          throw error;
        }
      }
    }

    console.log(`\n✅ RLS policies applied!`);
    console.log(`📊 Applied: ${applied}, Skipped: ${skipped}, Total: ${statements.length}\n`);
    
    await sql.end();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ RLS application failed:', error.message);
    console.error('\nFull error:', error);
    await sql.end();
    process.exit(1);
  }
}

applyRLS();
