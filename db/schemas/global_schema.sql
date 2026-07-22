-- Global/Control Schema for Multi-Branch School ERP
-- This schema manages branches, Super Admin, and cross-branch configuration

-- ============================================================================
-- CREATE GLOBAL SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS global;

-- ============================================================================
-- BRANCHES TABLE
-- ============================================================================

CREATE TABLE global.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_code VARCHAR(20) UNIQUE NOT NULL,
    branch_name VARCHAR(200) NOT NULL,
    schema_name VARCHAR(50) UNIQUE NOT NULL,  -- e.g., 'branch_1', 'branch_2'
    
    -- Contact Information
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    phone VARCHAR(50),
    email VARCHAR(200),
    website VARCHAR(300),
    
    -- Branch Configuration
    established_date DATE,
    affiliation_number VARCHAR(100),
    board VARCHAR(100),  -- CBSE, ICSE, State Board, etc.
    
    -- Capacity
    max_students INTEGER DEFAULT 15000,
    max_staff INTEGER DEFAULT 500,
    
    -- Status
    status status_type DEFAULT 'active',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    
    CONSTRAINT valid_schema_name CHECK (schema_name ~ '^branch_[0-9]+$')
);

-- ============================================================================
-- SUPER ADMIN USERS TABLE
-- ============================================================================

CREATE TABLE global.super_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(200) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    
    -- Google OAuth
    google_id VARCHAR(200),
    google_email VARCHAR(200),
    
    -- Permissions
    is_active BOOLEAN DEFAULT TRUE,
    bypass_all_permissions BOOLEAN DEFAULT TRUE,  -- Super Admin bypass flag
    
    -- Security
    last_login TIMESTAMPTZ,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    password_changed_at TIMESTAMPTZ
);

-- ============================================================================
-- GLOBAL USERS TABLE (Cross-branch user accounts)
-- ============================================================================

CREATE TABLE global.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(200) UNIQUE,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    
    -- Google OAuth
    google_id VARCHAR(200),
    google_email VARCHAR(200),
    
    -- User Type
    user_role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Branch Assignment (for staff/teachers)
    primary_branch_id UUID REFERENCES global.branches(id),
    
    -- Security
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    
    -- Remember Me Token
    remember_token VARCHAR(255),
    remember_token_expires TIMESTAMPTZ,
    
    -- Password Reset
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Trigger for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON global.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- USER BRANCH ACCESS (For users with access to multiple branches)
-- ============================================================================

CREATE TABLE global.user_branch_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES global.users(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES global.branches(id) ON DELETE CASCADE,
    role_in_branch user_role NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Permissions specific to this branch
    custom_permissions JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, branch_id)
);

-- ============================================================================
-- BRANCH TRANSFER REQUESTS
-- ============================================================================

CREATE TABLE global.branch_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Transfer Type
    transfer_type VARCHAR(20) NOT NULL CHECK (transfer_type IN ('student', 'staff')),
    record_id UUID NOT NULL,  -- ID in the source schema
    record_data JSONB,  -- Snapshot of transferred data
    
    -- Branch References
    from_branch_id UUID NOT NULL REFERENCES global.branches(id),
    to_branch_id UUID NOT NULL REFERENCES global.branches(id),
    from_schema VARCHAR(50) NOT NULL,
    to_schema VARCHAR(50) NOT NULL,
    
    -- Request Details
    requested_by UUID NOT NULL REFERENCES global.users(id),
    request_reason TEXT,
    
    -- Approval
    approval_status approval_status DEFAULT 'pending',
    approved_by UUID REFERENCES global.users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Fee Dues Handling
    has_pending_dues BOOLEAN DEFAULT FALSE,
    due_amount DECIMAL(12,2) DEFAULT 0,
    due_handling_option transfer_due_option,
    
    -- Academic Data Visibility
    full_data_requested BOOLEAN DEFAULT FALSE,
    full_data_request_by UUID REFERENCES global.users(id),
    full_data_approved_by UUID REFERENCES global.users(id),
    full_data_approved_at TIMESTAMPTZ,
    
    -- Scholarship
    scholarship_cancelled BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ============================================================================
-- GLOBAL CONFIGURATION
-- ============================================================================

CREATE TABLE global.configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,  -- Can be accessed without auth
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default configurations
INSERT INTO global.configurations (key, value, description, is_public) VALUES
('school_name', '"Multi-Branch School ERP"', 'School name displayed in the system', true),
('max_branches', '10', 'Maximum number of branches allowed', false),
('academic_year_start_month', '4', 'Academic year start month (April = 4)', true),
('default_week_start', '"monday"', 'Default week start day', true),
('grace_period_days', '3', 'Grace period for late fees in days', true),
('max_login_attempts', '5', 'Maximum login attempts before lockout', false),
('lockout_duration_minutes', '30', 'Account lockout duration in minutes', false),
('password_reset_expiry_hours', '24', 'Password reset link expiry in hours', false);

-- ============================================================================
-- NOTIFICATION TEMPLATES
-- ============================================================================

CREATE TABLE global.notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_code VARCHAR(100) UNIQUE NOT NULL,
    template_name VARCHAR(200) NOT NULL,
    subject VARCHAR(300),
    body TEXT NOT NULL,
    variables JSONB DEFAULT '[]',  -- List of template variables
    
    -- Channels
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EMAIL LOG
-- ============================================================================

CREATE TABLE global.email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES global.notification_templates(id),
    
    recipient_email VARCHAR(200) NOT NULL,
    subject VARCHAR(300),
    body TEXT,
    
    status VARCHAR(20) DEFAULT 'pending',  -- pending, sent, failed
    error_message TEXT,
    
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PUSH NOTIFICATION LOG
-- ============================================================================

CREATE TABLE global.push_notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES global.users(id),
    title VARCHAR(200) NOT NULL,
    body TEXT,
    data JSONB DEFAULT '{}',
    
    status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUDIT LOG (Global actions)
-- ============================================================================

CREATE TABLE global.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Who
    user_id UUID REFERENCES global.users(id),
    user_role user_role,
    user_ip INET,
    
    -- What
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    
    -- Where
    branch_id UUID REFERENCES global.branches(id),
    schema_name VARCHAR(50),
    
    -- When
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for audit logs
CREATE INDEX idx_audit_logs_user ON global.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON global.audit_logs(action);
CREATE INDEX idx_audit_logs_branch ON global.audit_logs(branch_id);
CREATE INDEX idx_audit_logs_created ON global.audit_logs(created_at);

-- ============================================================================
-- SESSIONS TABLE
-- ============================================================================

CREATE TABLE global.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES global.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    
    device_info JSONB,
    ip_address INET,
    
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_user ON global.sessions(user_id);
CREATE INDEX idx_sessions_token ON global.sessions(token_hash);

-- ============================================================================
-- API KEYS (For integrations)
-- ============================================================================

CREATE TABLE global.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES global.users(id) ON DELETE CASCADE,
    
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    permissions JSONB DEFAULT '[]',
    
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- ============================================================================
-- DATABASE VERSION TRACKING
-- ============================================================================

CREATE TABLE global.schema_versions (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO global.schema_versions (version, description) VALUES
('1.0.0', 'Initial global schema');
