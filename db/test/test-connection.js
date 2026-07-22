/**
 * Database Connection Test
 * Tests the connection to PostgreSQL and verifies schema setup
 */

require('dotenv').config();
const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'school_erp',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function testConnection() {
  console.log('🔍 Testing Database Connection...\n');
  
  try {
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully!\n');
    
    // Check if extensions are installed
    const extensionsResult = await client.query(`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname IN ('uuid-ossp', 'pgcrypto', 'postgis')
      ORDER BY extname
    `);
    
    console.log('📦 Installed Extensions:');
    if (extensionsResult.rows.length > 0) {
      extensionsResult.rows.forEach(ext => {
        console.log(`   ✓ ${ext.extname} (${ext.extversion})`);
      });
    } else {
      console.log('   ⚠️  No extensions found. Run init.sql first.');
    }
    console.log('');
    
    // Check global schema
    const globalSchemaResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'global'
    `);
    
    console.log('🌐 Global Schema:');
    if (globalSchemaResult.rows.length > 0) {
      console.log('   ✓ Global schema exists');
      
      // Count tables in global schema
      const globalTablesResult = await client.query(`
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'global'
      `);
      console.log(`   ✓ ${globalTablesResult.rows[0].table_count} tables found`);
    } else {
      console.log('   ⚠️  Global schema not found. Run global_schema.sql first.');
    }
    console.log('');
    
    // Check branch schemas
    const branchSchemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name LIKE 'branch_%'
      ORDER BY schema_name
    `);
    
    console.log('🏫 Branch Schemas:');
    if (branchSchemasResult.rows.length > 0) {
      for (const row of branchSchemasResult.rows) {
        const schemaName = row.schema_name;
        const tablesResult = await client.query(`
          SELECT COUNT(*) as table_count 
          FROM information_schema.tables 
          WHERE table_schema = $1
        `, [schemaName]);
        console.log(`   ✓ ${schemaName}: ${tablesResult.rows[0].table_count} tables`);
      }
    } else {
      console.log('   ⚠️  No branch schemas found. Run branch_template.sql first.');
    }
    console.log('');
    
    // Check branches in global.branches table
    const branchesResult = await client.query(`
      SELECT branch_code, branch_name, schema_name, status 
      FROM global.branches
      ORDER BY branch_code
    `);
    
    console.log('📋 Registered Branches:');
    if (branchesResult.rows.length > 0) {
      branchesResult.rows.forEach(branch => {
        console.log(`   ✓ ${branch.branch_code}: ${branch.branch_name} (${branch.schema_name}) - ${branch.status}`);
      });
    } else {
      console.log('   ⚠️  No branches registered. Run global_seed.sql first.');
    }
    console.log('');
    
    // Check custom types
    const typesResult = await client.query(`
      SELECT typname, typcategory 
      FROM pg_type 
      WHERE typname IN (
        'user_role', 'gender_type', 'status_type', 'room_status',
        'approval_status', 'attendance_status', 'payment_status',
        'leave_status', 'room_type', 'hostel_room_type', 'leave_type',
        'exam_type', 'vehicle_type', 'book_status', 'day_of_week',
        'meal_type', 'payment_cycle', 'transfer_due_option'
      )
      ORDER BY typname
    `);
    
    console.log('🔤 Custom ENUM Types:');
    typesResult.rows.forEach(type => {
      console.log(`   ✓ ${type.typname}`);
    });
    console.log('');
    
    // Check super admin
    const superAdminResult = await client.query(`
      SELECT email, username, full_name, is_active 
      FROM global.super_admins
      LIMIT 1
    `);
    
    console.log('👤 Super Admin:');
    if (superAdminResult.rows.length > 0) {
      const admin = superAdminResult.rows[0];
      console.log(`   ✓ ${admin.full_name} (${admin.username}) - ${admin.email}`);
      console.log(`   ✓ Status: ${admin.is_active ? 'Active' : 'Inactive'}`);
    } else {
      console.log('   ⚠️  No super admin found. Run global_seed.sql first.');
    }
    console.log('');
    
    console.log('✅ Database test completed successfully!\n');
    
    client.release();
    
    return {
      success: true,
      extensions: extensionsResult.rows.length,
      globalSchema: globalSchemaResult.rows.length > 0,
      branchSchemas: branchSchemasResult.rows.length,
      branches: branchesResult.rows.length,
      customTypes: typesResult.rows.length
    };
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('\nPlease ensure:');
    console.error('  1. PostgreSQL is running');
    console.error('  2. Database credentials are correct in .env file');
    console.error('  3. Database "school_erp" exists');
    console.error('  4. init.sql has been executed\n');
    
    return {
      success: false,
      error: error.message
    };
  } finally {
    await pool.end();
  }
}

// Run test
testConnection().then(result => {
  process.exit(result.success ? 0 : 1);
});
