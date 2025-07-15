import { config } from 'dotenv';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

// Load environment variables
config({ path: '.env.local' });

interface MigrationFile {
  filename: string;
  filepath: string;
  version: number;
}

async function createMigrationsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Migrations table ready');
  } catch (error) {
    console.error('❌ Error creating migrations table:', error);
    throw error;
  }
}

async function getExecutedMigrations(): Promise<string[]> {
  try {
    const result = await sql`SELECT filename FROM _migrations ORDER BY filename`;
    return result.rows.map(row => row.filename);
  } catch (error) {
    console.error('❌ Error fetching executed migrations:', error);
    throw error;
  }
}

function getMigrationFiles(): MigrationFile[] {
  const migrationsDir = path.join(process.cwd(), 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('📁 Creating migrations directory...');
    fs.mkdirSync(migrationsDir, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(filename => {
      const match = filename.match(/^(\d+)_/);
      const version = match ? parseInt(match[1], 10) : 0;
      
      return {
        filename,
        filepath: path.join(migrationsDir, filename),
        version
      };
    });

  return files;
}

async function runMigration(migration: MigrationFile) {
  console.log(`\n🔄 Running migration: ${migration.filename}`);
  
  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync(migration.filepath, 'utf8');
    
    // Split by semicolons but be careful with functions/triggers
    const statements = sqlContent
      .split(/;(?=\s*(?:--|$|CREATE|DROP|ALTER|INSERT|UPDATE|DELETE|GRANT|REVOKE|BEGIN|COMMIT|ROLLBACK))/i)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`  📝 Executing statement ${i + 1}/${statements.length}`);
        await sql.query(statement);
      }
    }
    
    // Record the migration as executed
    await sql`
      INSERT INTO _migrations (filename) 
      VALUES (${migration.filename})
    `;
    
    console.log(`✅ Migration completed: ${migration.filename}`);
  } catch (error) {
    console.error(`❌ Error running migration ${migration.filename}:`, error);
    throw error;
  }
}

async function migrate() {
  console.log('🚀 Starting database migration...\n');
  
  try {
    // Ensure migrations table exists
    await createMigrationsTable();
    
    // Get list of executed migrations
    const executedMigrations = await getExecutedMigrations();
    console.log(`📋 Found ${executedMigrations.length} executed migrations`);
    
    // Get all migration files
    const migrationFiles = getMigrationFiles();
    console.log(`📁 Found ${migrationFiles.length} migration files`);
    
    // Filter pending migrations
    const pendingMigrations = migrationFiles.filter(
      m => !executedMigrations.includes(m.filename)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('\n✨ Database is already up to date!');
      return;
    }
    
    console.log(`\n🔧 ${pendingMigrations.length} pending migrations to run`);
    
    // Run pending migrations in order
    for (const migration of pendingMigrations) {
      await runMigration(migration);
    }
    
    console.log('\n🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { migrate };