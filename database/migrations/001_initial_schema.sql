-- Verity AI Database Schema (PostgreSQL)
-- Migration: 001_initial_schema.sql

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'comum', -- 'comum' ($90), 'solo' ($200), 'equipe' ($700)
    default_mode VARCHAR(50) NOT NULL DEFAULT 'normal', -- 'empresa' or 'normal'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(lower(email));

-- 2. Chat Sessions & Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender VARCHAR(30) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    mode VARCHAR(50) NOT NULL DEFAULT 'normal', -- 'empresa' or 'normal'
    action_type VARCHAR(100), -- 'generate_docx', 'generate_xlsx', 'generate_pdf', 'send_email', 'financial_calc', 'file_organize'
    action_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_user_session ON chat_messages(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_messages(created_at);

-- 3. Executed Tasks and Generated Documents Metadata
CREATE TABLE IF NOT EXISTS executed_tasks (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_type VARCHAR(100) NOT NULL, -- 'word', 'excel', 'pdf', 'email', 'calculation', 'file_organize'
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'completed', 'preview', 'failed'
    file_name VARCHAR(255),
    file_url VARCHAR(500),
    details_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_user ON executed_tasks(user_id, created_at DESC);

-- 4. User Preferences Table (Optional Key-Value overrides)
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'dark',
    authorized_folder_path VARCHAR(500),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
