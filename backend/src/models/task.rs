use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecutedTask {
    pub id: String,
    pub user_id: String,
    pub task_type: String, // "word", "excel", "pdf", "email", "calculation", "file_organize", "todo"
    pub title: String,
    pub status: String,    // "completed", "preview", "failed"
    pub file_name: Option<String>,
    pub file_url: Option<String>,
    pub details_json: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateTaskRecordRequest {
    pub task_type: String,
    pub title: String,
    pub status: String,
    pub file_name: Option<String>,
    pub file_url: Option<String>,
    pub details: Option<serde_json::Value>,
}
