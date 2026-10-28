use axum::{
    extract::{Query, State},
    http::HeaderMap,
    Json,
};
use std::sync::Arc;
use serde::Deserialize;
use crate::error::AppError;
use crate::models::chat::{ChatMessage, SendMessageRequest, SendMessageResponse};
use crate::routes::auth_routes::extract_bearer_token;
use crate::services::ai_service::AiService;
use crate::services::auth_service::AuthService;
use crate::db::DbPool;

#[derive(Deserialize)]
pub struct ChatHistoryQuery {
    pub session_id: Option<String>,
}

pub async fn send_message_handler(
    State((ai_service, auth_service)): State<(Arc<AiService>, Arc<AuthService>)>,
    headers: HeaderMap,
    Json(payload): Json<SendMessageRequest>,
) -> Result<Json<SendMessageResponse>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = auth_service.verify_token(&token)?;

    let res = ai_service.process_message(&claims.sub, payload).await?;
    Ok(Json(res))
}

pub async fn get_chat_history_handler(
    State((db, auth_service)): State<(DbPool, Arc<AuthService>)>,
    headers: HeaderMap,
    Query(query): Query<ChatHistoryQuery>,
) -> Result<Json<Vec<ChatMessage>>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = auth_service.verify_token(&token)?;

    let history = db.get_chat_history(&claims.sub, query.session_id.as_deref())?;
    Ok(Json(history))
}
