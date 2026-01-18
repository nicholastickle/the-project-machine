import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL);

console.log('📊 Checking database tables...\n');

const tables = await sql`
  SELECT tablename 
  FROM pg_tables 
  WHERE schemaname = 'public' 
  ORDER BY tablename
`;

console.log(`✅ Found ${tables.length} tables:\n`);
tables.forEach(t => console.log(`  - ${t.tablename}`));

await sql.end();
