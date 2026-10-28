use rusqlite::{params, Connection};
use std::sync::{Arc, Mutex};
use crate::error::AppError;
use crate::models::user::User;
use crate::models::chat::ChatMessage;
use crate::models::task::ExecutedTask;

#[derive(Clone)]
pub struct DbPool {
    conn: Arc<Mutex<Connection>>,
}

impl DbPool {
    pub fn new(path: &str) -> Result<Self, AppError> {
        let conn = Connection::open(path)
            .map_err(|e| AppError::Database(format!("Falha ao abrir banco de dados SQLite: {}", e)))?;

        // Initialize schema
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                plan TEXT NOT NULL DEFAULT 'comum',
                default_mode TEXT NOT NULL DEFAULT 'normal',
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS chat_messages (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                sender TEXT NOT NULL,
                content TEXT NOT NULL,
                mode TEXT NOT NULL DEFAULT 'normal',
                action_type TEXT,
                action_payload TEXT,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS executed_tasks (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                task_type TEXT NOT NULL,
                title TEXT NOT NULL,
                status TEXT NOT NULL,
                file_name TEXT,
                file_url TEXT,
                details_json TEXT,
                created_at TEXT NOT NULL
            );
            "
        ).map_err(|e| AppError::Database(format!("Falha ao inicializar tabelas: {}", e)))?;

        Ok(Self {
            conn: Arc::new(Mutex::new(conn)),
        })
    }

    // --- Users ---
    pub fn insert_user(&self, user: &User) -> Result<(), AppError> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO users (id, name, email, password_hash, plan, default_mode, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![
                user.id,
                user.name,
                user.email,
                user.password_hash,
                user.plan,
                user.default_mode,
                user.created_at
            ],
        ).map_err(|e| AppError::Database(format!("Falha ao cadastrar usuário: {}", e)))?;
        Ok(())
    }

    pub fn find_user_by_email(&self, email: &str) -> Result<Option<User>, AppError> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn
            .prepare("SELECT id, name, email, password_hash, plan, default_mode, created_at FROM users WHERE lower(email) = lower(?1)")
            .map_err(|e| AppError::Database(e.to_string()))?;

        let mut rows = stmt
            .query(params![email])
            .map_err(|e| AppError::Database(e.to_string()))?;

        if let Some(row) = rows.next().map_err(|e| AppError::Database(e.to_string()))? {
            Ok(Some(User {
                id: row.get(0).map_err(|e| AppError::Database(e.to_string()))?,
                name: row.get(1).map_err(|e| AppError::Database(e.to_string()))?,
                email: row.get(2).map_err(|e| AppError::Database(e.to_string()))?,
                password_hash: row.get(3).map_err(|e| AppError::Database(e.to_string()))?,
                plan: row.get(4).map_err(|e| AppError::Database(e.to_string()))?,
                default_mode: row.get(5).map_err(|e| AppError::Database(e.to_string()))?,
                created_at: row.get(6).map_err(|e| AppError::Database(e.to_string()))?,
            }))
        } else {
            Ok(None)
        }
    }

    pub fn find_user_by_id(&self, id: &str) -> Result<Option<User>, AppError> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn
            .prepare("SELECT id, name, email, password_hash, plan, default_mode, created_at FROM users WHERE id = ?1")
            .map_err(|e| AppError::Database(e.to_string()))?;

        let mut rows = stmt
            .query(params![id])
            .map_err(|e| AppError::Database(e.to_string()))?;

        if let Some(row) = rows.next().map_err(|e| AppError::Database(e.to_string()))? {
            Ok(Some(User {
                id: row.get(0).map_err(|e| AppError::Database(e.to_string()))?,
                name: row.get(1).map_err(|e| AppError::Database(e.to_string()))?,
                email: row.get(2).map_err(|e| AppError::Database(e.to_string()))?,
                password_hash: row.get(3).map_err(|e| AppError::Database(e.to_string()))?,
                plan: row.get(4).map_err(|e| AppError::Database(e.to_string()))?,
                default_mode: row.get(5).map_err(|e| AppError::Database(e.to_string()))?,
                created_at: row.get(6).map_err(|e| AppError::Database(e.to_string()))?,
            }))
        } else {
            Ok(None)
        }
    }

    pub fn update_user_profile(&self, id: &str, name: Option<&str>, default_mode: Option<&str>, plan: Option<&str>) -> Result<(), AppError> {
        let conn = self.conn.lock().unwrap();
        if let Some(n) = name {
            conn.execute("UPDATE users SET name = ?1 WHERE id = ?2", params![n, id])
                .map_err(|e| AppError::Database(e.to_string()))?;
        }
        if let Some(m) = default_mode {
            conn.execute("UPDATE users SET default_mode = ?1 WHERE id = ?2", params![m, id])
                .map_err(|e| AppError::Database(e.to_string()))?;
        }
        if let Some(p) = plan {
            conn.execute("UPDATE users SET plan = ?1 WHERE id = ?2", params![p, id])
                .map_err(|e| AppError::Database(e.to_string()))?;
        }
        Ok(())
    }

    // --- Chat Messages ---
    pub fn insert_message(&self, msg: &ChatMessage) -> Result<(), AppError> {
        let conn = self.conn.lock().unwrap();
        let payload_str = msg.action_payload.as_ref().map(|v| v.to_string());
        conn.execute(
            "INSERT INTO chat_messages (id, session_id, user_id, sender, content, mode, action_type, action_payload, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![
                msg.id,
                msg.session_id,
                msg.user_id,
                msg.sender,
                msg.content,
                msg.mode,
                msg.action_type,
                payload_str,
                msg.created_at
            ],
        ).map_err(|e| AppError::Database(format!("Falha ao salvar mensagem: {}", e)))?;
        Ok(())
    }

    pub fn get_chat_history(&self, user_id: &str, session_id: Option<&str>) -> Result<Vec<ChatMessage>, AppError> {
        let conn = self.conn.lock().unwrap();
        let mut list = Vec::new();

        if let Some(sid) = session_id {
            let mut stmt = conn.prepare(
                "SELECT id, session_id, user_id, sender, content, mode, action_type, action_payload, created_at
                 FROM chat_messages WHERE user_id = ?1 AND session_id = ?2 ORDER BY created_at ASC"
            ).map_err(|e| AppError::Database(e.to_string()))?;

            let rows = stmt.query_map(params![user_id, sid], |row| {
                let payload_str: Option<String> = row.get(7)?;
                let action_payload = payload_str.and_then(|s| serde_json::from_str(&s).ok());
                Ok(ChatMessage {
                    id: row.get(0)?,
                    session_id: row.get(1)?,
                    user_id: row.get(2)?,
                    sender: row.get(3)?,
                    content: row.get(4)?,
                    mode: row.get(5)?,
                    action_type: row.get(6)?,
                    action_payload,
                    created_at: row.get(8)?,
                })
            }).map_err(|e| AppError::Database(e.to_string()))?;

            for r in rows {
                if let Ok(m) = r {
                    list.push(m);
                }
            }
        } else {
            let mut stmt = conn.prepare(
                "SELECT id, session_id, user_id, sender, content, mode, action_type, action_payload, created_at
                 FROM chat_messages WHERE user_id = ?1 ORDER BY created_at ASC LIMIT 100"
            ).map_err(|e| AppError::Database(e.to_string()))?;

            let rows = stmt.query_map(params![user_id], |row| {
                let payload_str: Option<String> = row.get(7)?;
                let action_payload = payload_str.and_then(|s| serde_json::from_str(&s).ok());
                Ok(ChatMessage {
                    id: row.get(0)?,
                    session_id: row.get(1)?,
                    user_id: row.get(2)?,
                    sender: row.get(3)?,
                    content: row.get(4)?,
                    mode: row.get(5)?,
                    action_type: row.get(6)?,
                    action_payload,
                    created_at: row.get(8)?,
                })
            }).map_err(|e| AppError::Database(e.to_string()))?;

            for r in rows {
                if let Ok(m) = r {
                    list.push(m);
                }
            }
        }

        Ok(list)
    }

    // --- Executed Tasks ---
    pub fn insert_task(&self, task: &ExecutedTask) -> Result<(), AppError> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO executed_tasks (id, user_id, task_type, title, status, file_name, file_url, details_json, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![
                task.id,
                task.user_id,
                task.task_type,
                task.title,
                task.status,
                task.file_name,
                task.file_url,
                task.details_json,
                task.created_at
            ],
        ).map_err(|e| AppError::Database(format!("Falha ao salvar tarefa: {}", e)))?;
        Ok(())
    }

    pub fn list_tasks(&self, user_id: &str) -> Result<Vec<ExecutedTask>, AppError> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, user_id, task_type, title, status, file_name, file_url, details_json, created_at
             FROM executed_tasks WHERE user_id = ?1 ORDER BY created_at DESC LIMIT 50"
        ).map_err(|e| AppError::Database(e.to_string()))?;

        let rows = stmt.query_map(params![user_id], |row| {
            Ok(ExecutedTask {
                id: row.get(0)?,
                user_id: row.get(1)?,
                task_type: row.get(2)?,
                title: row.get(3)?,
                status: row.get(4)?,
                file_name: row.get(5)?,
                file_url: row.get(6)?,
                details_json: row.get(7)?,
                created_at: row.get(8)?,
            })
        }).map_err(|e| AppError::Database(e.to_string()))?;

        let mut list = Vec::new();
        for r in rows {
            if let Ok(t) = r {
                list.push(t);
            }
        }
        Ok(list)
    }
}
