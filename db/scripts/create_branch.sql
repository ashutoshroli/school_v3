-- Script to Create a New Branch Schema
-- Usage: psql -f create_branch.sql -v branch_number=1 -v branch_name="Main Campus"

-- ============================================================================
-- FUNCTION: Create new branch with cloned schema
-- ============================================================================

CREATE OR REPLACE FUNCTION create_branch(
    p_branch_code VARCHAR,
    p_branch_name VARCHAR,
    p_address TEXT DEFAULT NULL,
    p_city VARCHAR DEFAULT NULL,
    p_state VARCHAR DEFAULT NULL,
    p_pincode VARCHAR DEFAULT NULL,
    p_phone VARCHAR DEFAULT NULL,
    p_email VARCHAR DEFAULT NULL,
    p_max_students INTEGER DEFAULT 15000,
    p_max_staff INTEGER DEFAULT 500
)
RETURNS UUID
AS $$
DECLARE
    v_branch_id UUID;
    v_schema_name VARCHAR;
    v_branch_number INTEGER;
BEGIN
    -- Get next branch number
    SELECT COALESCE(MAX(CAST(REPLACE(schema_name, 'branch_', '') AS INTEGER)), 0) + 1
    INTO v_branch_number
    FROM global.branches;
    
    v_schema_name := 'branch_' || v_branch_number;
    
    -- Insert into branches table
    INSERT INTO global.branches (
        branch_code,
        branch_name,
        schema_name,
        address,
        city,
        state,
        pincode,
        phone,
        email,
        max_students,
        max_staff
    ) VALUES (
        p_branch_code,
        p_branch_name,
        v_schema_name,
        p_address,
        p_city,
        p_state,
        p_pincode,
        p_phone,
        p_email,
        p_max_students,
        p_max_staff
    )
    RETURNING id INTO v_branch_id;
    
    -- Create the schema
    EXECUTE 'CREATE SCHEMA IF NOT EXISTS ' || v_schema_name;
    
    -- Clone template schema to new schema
    -- This would typically be done by running the branch_template.sql
    -- with template replaced by the new schema name
    
    RETURN v_branch_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Clone template tables to new branch
-- ============================================================================

CREATE OR REPLACE FUNCTION clone_branch_template(p_target_schema VARCHAR)
RETURNS VOID
AS $$
DECLARE
    tbl RECORD;
BEGIN
    -- Copy all tables from template to target schema
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'template'
    LOOP
        EXECUTE format('CREATE TABLE %I.%I (LIKE template.%I INCLUDING ALL)', 
                       p_target_schema, tbl.tablename, tbl.tablename);
        
        -- Copy data if needed (for settings, leave_types, etc.)
        -- EXECUTE format('INSERT INTO %I.%I SELECT * FROM template.%I', 
        --                p_target_schema, tbl.tablename, tbl.tablename);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- EXAMPLE USAGE
-- ============================================================================

-- Create first branch:
-- SELECT create_branch('BR001', 'Main Campus', '123 School Street', 'Mumbai', 'Maharashtra', '400001', '022-12345678', 'info@school.edu');

-- After running the above, run branch_template.sql with template replaced by branch_1:
-- sed 's/template/branch_1/g' branch_template.sql | psql
