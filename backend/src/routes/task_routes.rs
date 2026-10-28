use axum::{
    extract::State,
    http::HeaderMap,
    Json,
};
use std::sync::Arc;
use uuid::Uuid;
use chrono::Utc;
use crate::error::AppError;
use crate::models::task::{CreateTaskRecordRequest, ExecutedTask};
use crate::routes::auth_routes::extract_bearer_token;
use crate::services::auth_service::AuthService;
use crate::db::DbPool;

pub async fn list_tasks_handler(
    State((db, auth_service)): State<(DbPool, Arc<AuthService>)>,
    headers: HeaderMap,
) -> Result<Json<Vec<ExecutedTask>>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = auth_service.verify_token(&token)?;

    let tasks = db.list_tasks(&claims.sub)?;
    Ok(Json(tasks))
}

pub async fn create_task_handler(
    State((db, auth_service)): State<(DbPool, Arc<AuthService>)>,
    headers: HeaderMap,
    Json(payload): Json<CreateTaskRecordRequest>,
) -> Result<Json<ExecutedTask>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = auth_service.verify_token(&token)?;

    let details_str = payload.details.map(|d| d.to_string());

    let task = ExecutedTask {
        id: Uuid::new_v4().to_string(),
        user_id: claims.sub,
        task_type: payload.task_type,
        title: payload.title,
        status: payload.status,
        file_name: payload.file_name,
        file_url: payload.file_url,
        details_json: details_str,
        created_at: Utc::now().to_rfc3339(),
    };

    db.insert_task(&task)?;

    Ok(Json(task))
}
