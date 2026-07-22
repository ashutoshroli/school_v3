-- Migration: 001_initial_schema
-- Description: Initial database schema for Multi-Branch School ERP
-- Version: 1.0.0
-- Date: 2024-01-01

-- ============================================================================
-- PREREQUISITES
-- ============================================================================
-- 1. PostgreSQL 14+ with extensions: uuid-ossp, pgcrypto, postgis
-- 2. Run init.sql first to create extensions and custom types

-- ============================================================================
-- STEP 1: Create Global Schema
-- ============================================================================
-- Run: schemas/global_schema.sql

-- ============================================================================
-- STEP 2: Create Template Schema
-- ============================================================================
-- Run: schemas/branch_template.sql

-- ============================================================================
-- STEP 3: Create Branch Schemas
-- ============================================================================
-- For each branch, run the template with schema name replaced:
-- sed 's/template/branch_1/g' schemas/branch_template.sql | psql

-- ============================================================================
-- STEP 4: Seed Data
-- ============================================================================
-- Run: seeds/global_seed.sql
-- Run: seeds/branch_seed.sql (for each branch schema)

-- ============================================================================
-- ROLLBACK
-- ============================================================================
-- To rollback, drop schemas in reverse order:
-- DROP SCHEMA IF EXISTS branch_3 CASCADE;
-- DROP SCHEMA IF EXISTS branch_2 CASCADE;
-- DROP SCHEMA IF EXISTS branch_1 CASCADE;
-- DROP SCHEMA IF EXISTS template CASCADE;
-- DROP SCHEMA IF EXISTS global CASCADE;
-- DROP TYPE IF EXISTS user_role CASCADE;
-- ... (drop all custom types)

-- ============================================================================
-- POST-MIGRATION CHECKS
-- ============================================================================

-- Verify schemas exist
SELECT schema_name FROM information_schema.schemata 
WHERE schema_name IN ('global', 'template', 'branch_1', 'branch_2', 'branch_3');

-- Verify global tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'global' ORDER BY table_name;

-- Verify branch tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'branch_1' ORDER BY table_name LIMIT 20;

-- Verify branches are registered
SELECT branch_code, branch_name, schema_name, status FROM global.branches;

-- Verify super admin exists
SELECT email, username, full_name FROM global.super_admins LIMIT 1;
