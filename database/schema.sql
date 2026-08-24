-- =====================================================
-- Atlas AI - PostgreSQL Schema v2
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE plan_type_enum AS ENUM (
'free',
'pro'
);

CREATE TYPE project_status_enum AS ENUM (
'planning',
'generating',
'completed',
'archived'
);

CREATE TYPE message_role_enum AS ENUM (
'user',
'assistant',
'system'
);

CREATE TYPE agent_type_enum AS ENUM (
'ORCHESTRATOR',
'RESEARCH',
'PRODUCT',
'FRONTEND',
'DATABASE'
);

CREATE TYPE execution_status_enum AS ENUM (
'pending',
'running',
'completed',
'failed'
);

-- =====================================================
-- ORGANIZATIONS
-- =====================================================

CREATE TABLE organizations (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


name VARCHAR(255) NOT NULL,

slug VARCHAR(255) UNIQUE NOT NULL,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


organization_id UUID
    REFERENCES organizations(id)
    ON DELETE SET NULL,

first_name VARCHAR(255) NOT NULL,

last_name VARCHAR(255),

email VARCHAR(255) UNIQUE NOT NULL,

password_hash TEXT NOT NULL,

plan_type plan_type_enum DEFAULT 'free',

stripe_customer_id VARCHAR(255) UNIQUE,

email_verified BOOLEAN DEFAULT FALSE,

last_login TIMESTAMPTZ,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECTS
-- =====================================================

CREATE TABLE projects (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


organization_id UUID
    REFERENCES organizations(id)
    ON DELETE CASCADE,

owner_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

name VARCHAR(255) NOT NULL,

description TEXT,

status project_status_enum DEFAULT 'planning',

deleted_at TIMESTAMPTZ,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CHATS
-- =====================================================

CREATE TABLE chats (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

project_id UUID
    REFERENCES projects(id)
    ON DELETE SET NULL,

title VARCHAR(255) NOT NULL DEFAULT 'Nova Conversa',

is_archived BOOLEAN DEFAULT FALSE,

deleted_at TIMESTAMPTZ,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MESSAGES
-- =====================================================

CREATE TABLE messages (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


chat_id UUID NOT NULL
    REFERENCES chats(id)
    ON DELETE CASCADE,

role message_role_enum NOT NULL,

content TEXT NOT NULL,

tokens_used INTEGER DEFAULT 0,

created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AGENTS
-- =====================================================

CREATE TABLE agents (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


name VARCHAR(255) NOT NULL,

type agent_type_enum NOT NULL,

model_name VARCHAR(255),

provider VARCHAR(255),

is_active BOOLEAN DEFAULT TRUE,

created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ARTIFACTS
-- =====================================================

CREATE TABLE artifacts (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


project_id UUID NOT NULL
    REFERENCES projects(id)
    ON DELETE CASCADE,

created_by UUID
    REFERENCES users(id)
    ON DELETE SET NULL,

agent_type agent_type_enum NOT NULL,

artifact_type VARCHAR(100) NOT NULL,

version INTEGER DEFAULT 1,

content JSONB NOT NULL,

deleted_at TIMESTAMPTZ,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AGENT EXECUTIONS
-- =====================================================

CREATE TABLE agent_executions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


project_id UUID
    REFERENCES projects(id)
    ON DELETE CASCADE,

agent_id UUID
    REFERENCES agents(id)
    ON DELETE SET NULL,

status execution_status_enum DEFAULT 'pending',

execution_time_ms INTEGER,

input_data JSONB,

output_data JSONB,

error_message TEXT,

created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BILLING / TOKEN AUDIT
-- =====================================================

CREATE TABLE ai_metrics_logs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

model_used VARCHAR(255) NOT NULL,

provider VARCHAR(255),

request_type VARCHAR(100),

tokens_prompt INTEGER DEFAULT 0,

tokens_completion INTEGER DEFAULT 0,

total_tokens INTEGER GENERATED ALWAYS AS
(
    tokens_prompt + tokens_completion
) STORED,

total_cost DECIMAL(12,6) DEFAULT 0.000000,

created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- UPDATE_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_chats_updated_at
BEFORE UPDATE ON chats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_artifacts_updated_at
BEFORE UPDATE ON artifacts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_projects_owner
ON projects(owner_id);

CREATE INDEX idx_projects_org
ON projects(organization_id);

CREATE INDEX idx_chats_user
ON chats(user_id);

CREATE INDEX idx_chats_project
ON chats(project_id);

CREATE INDEX idx_messages_chat
ON messages(chat_id);

CREATE INDEX idx_messages_created
ON messages(created_at DESC);

CREATE INDEX idx_artifacts_project
ON artifacts(project_id);

CREATE INDEX idx_agent_exec_project
ON agent_executions(project_id);

CREATE INDEX idx_ai_metrics_user
ON ai_metrics_logs(user_id);

CREATE INDEX idx_artifacts_json
ON artifacts USING GIN(content);

