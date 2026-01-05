import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL);

const tables = ['projects', 'tasks', 'subtasks', 'task_comments', 'reflections', 'taskbook_entries'];

for (const table of tables) {
  const cols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = ${table} 
    ORDER BY ordinal_position
  `;
  console.log(`\n${table}:`);
  cols.forEach(c => console.log(`  - ${c.column_name} (${c.data_type})`));
}

await sql.end();
