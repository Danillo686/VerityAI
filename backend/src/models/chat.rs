use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub id: String,
    pub session_id: String,
    pub user_id: String,
    pub sender: String, // "user", "assistant", "system"
    pub content: String,
    pub mode: String,   // "empresa", "normal"
    pub action_type: Option<String>, // "generate_docx", "generate_xlsx", "generate_pdf", "send_email", "financial_calc", "file_organize"
    pub action_payload: Option<serde_json::Value>,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct SendMessageRequest {
    pub session_id: Option<String>,
    pub message: String,
    pub mode: Option<String>, // "empresa" or "normal"
}

#[derive(Debug, Serialize)]
pub struct SendMessageResponse {
    pub session_id: String,
    pub message: ChatMessage,
    pub is_simulation: bool,
}
