require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { supabase } = require('../db/supabase');

async function initializeDatabase() {
  console.log('Initializing Supabase database...');
  
  try {
    // Read SQL file content
    const sqlFilePath = path.join(__dirname, 'create_tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split SQL into individual statements (crude but works for basic SQL)
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}`);
      
      // Execute the statement
      const { error } = await supabase.rpc('exec_sql', { sql_statement: statement });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        // Continue with other statements even if one fails
      }
    }
    
    console.log('Database initialization complete!');
    
    // Verify by selecting from sessions table
    const { data, error } = await supabase
      .from('sessions')
      .select('*');
    
    if (error) {
      console.error('Error verifying tables:', error);
    } else {
      console.log(`Successfully created tables! Found ${data.length} sessions.`);
      console.log(data);
    }
    
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
}

// Run the initialization
initializeDatabase().catch(console.error);
