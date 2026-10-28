use axum::{
    body::Body,
    extract::{Path, State},
    http::{header, HeaderMap, HeaderValue, StatusCode},
    response::Response,
    Json,
};
use std::sync::Arc;
use serde_json::Value;
use uuid::Uuid;
use chrono::Utc;
use crate::error::AppError;
use crate::models::task::ExecutedTask;
use crate::routes::auth_routes::extract_bearer_token;
use crate::services::auth_service::AuthService;
use crate::services::automation_client::AutomationClient;
use crate::db::DbPool;

#[derive(Clone)]
pub struct AutomationAppState {
    pub automation_client: Arc<AutomationClient>,
    pub auth_service: Arc<AuthService>,
    pub db: DbPool,
}

pub async fn health_handler(
    State(state): State<AutomationAppState>,
) -> Result<Json<Value>, AppError> {
    let health = state.automation_client.check_health().await?;
    Ok(Json(health))
}

pub async fn generate_docx_handler(
    State(state): State<AutomationAppState>,
    headers: HeaderMap,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = state.auth_service.verify_token(&token)?;

    let result = state.automation_client.generate_docx(&payload).await?;

    let filename = result.get("filename").and_then(|v| v.as_str()).map(|s| s.to_string());
    let download_url = result.get("download_url").and_then(|v| v.as_str()).map(|s| s.to_string());

    // Record task
    let task = ExecutedTask {
        id: Uuid::new_v4().to_string(),
        user_id: claims.sub,
        task_type: "word".to_string(),
        title: payload.get("title").and_then(|v| v.as_str()).unwrap_or("Documento Word").to_string(),
        status: "completed".to_string(),
        file_name: filename,
        file_url: download_url,
        details_json: Some(result.to_string()),
        created_at: Utc::now().to_rfc3339(),
    };
    let _ = state.db.insert_task(&task);

    Ok(Json(result))
}

pub async fn generate_xlsx_handler(
    State(state): State<AutomationAppState>,
    headers: HeaderMap,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = state.auth_service.verify_token(&token)?;

    let result = state.automation_client.generate_xlsx(&payload).await?;

    let filename = result.get("filename").and_then(|v| v.as_str()).map(|s| s.to_string());
    let download_url = result.get("download_url").and_then(|v| v.as_str()).map(|s| s.to_string());

    let task = ExecutedTask {
        id: Uuid::new_v4().to_string(),
        user_id: claims.sub,
        task_type: "excel".to_string(),
        title: payload.get("title").and_then(|v| v.as_str()).unwrap_or("Planilha Excel").to_string(),
        status: "completed".to_string(),
        file_name: filename,
        file_url: download_url,
        details_json: Some(result.to_string()),
        created_at: Utc::now().to_rfc3339(),
    };
    let _ = state.db.insert_task(&task);

    Ok(Json(result))
}

pub async fn generate_pdf_handler(
    State(state): State<AutomationAppState>,
    headers: HeaderMap,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = state.auth_service.verify_token(&token)?;

    let result = state.automation_client.generate_pdf(&payload).await?;

    let filename = result.get("filename").and_then(|v| v.as_str()).map(|s| s.to_string());
    let download_url = result.get("download_url").and_then(|v| v.as_str()).map(|s| s.to_string());

    let task = ExecutedTask {
        id: Uuid::new_v4().to_string(),
        user_id: claims.sub,
        task_type: "pdf".to_string(),
        title: payload.get("title").and_then(|v| v.as_str()).unwrap_or("Relatório PDF").to_string(),
        status: "completed".to_string(),
        file_name: filename,
        file_url: download_url,
        details_json: Some(result.to_string()),
        created_at: Utc::now().to_rfc3339(),
    };
    let _ = state.db.insert_task(&task);

    Ok(Json(result))
}

pub async fn send_email_handler(
    State(state): State<AutomationAppState>,
    headers: HeaderMap,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = state.auth_service.verify_token(&token)?;

    let result = state.automation_client.send_email(&payload).await?;

    let is_preview = payload.get("is_preview").and_then(|v| v.as_bool()).unwrap_or(false);
    let confirm = payload.get("confirm").and_then(|v| v.as_bool()).unwrap_or(false);

    let task = ExecutedTask {
        id: Uuid::new_v4().to_string(),
        user_id: claims.sub,
        task_type: "email".to_string(),
        title: format!("E-mail para {}", payload.get("recipient").and_then(|v| v.as_str()).unwrap_or("destinatário")),
        status: if is_preview || !confirm { "preview".to_string() } else { "completed".to_string() },
        file_name: None,
        file_url: None,
        details_json: Some(result.to_string()),
        created_at: Utc::now().to_rfc3339(),
    };
    let _ = state.db.insert_task(&task);

    Ok(Json(result))
}

pub async fn calculate_handler(
    State(state): State<AutomationAppState>,
    headers: HeaderMap,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = state.auth_service.verify_token(&token)?;

    let result = state.automation_client.calculate_financial(&payload).await?;

    let task = ExecutedTask {
        id: Uuid::new_v4().to_string(),
        user_id: claims.sub,
        task_type: "calculation".to_string(),
        title: "Cálculo de Margens & Finanças".to_string(),
        status: "completed".to_string(),
        file_name: None,
        file_url: None,
        details_json: Some(result.to_string()),
        created_at: Utc::now().to_rfc3339(),
    };
    let _ = state.db.insert_task(&task);

    Ok(Json(result))
}

pub async fn organize_files_handler(
    State(state): State<AutomationAppState>,
    headers: HeaderMap,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = state.auth_service.verify_token(&token)?;

    let result = state.automation_client.organize_files(&payload).await?;

    let is_preview = payload.get("is_preview").and_then(|v| v.as_bool()).unwrap_or(true);
    let confirm = payload.get("confirm").and_then(|v| v.as_bool()).unwrap_or(false);

    let task = ExecutedTask {
        id: Uuid::new_v4().to_string(),
        user_id: claims.sub,
        task_type: "file_organize".to_string(),
        title: format!("Organização de Pasta: {}", payload.get("target_directory").and_then(|v| v.as_str()).unwrap_or("pasta")),
        status: if is_preview || !confirm { "preview".to_string() } else { "completed".to_string() },
        file_name: None,
        file_url: None,
        details_json: Some(result.to_string()),
        created_at: Utc::now().to_rfc3339(),
    };
    let _ = state.db.insert_task(&task);

    Ok(Json(result))
}

pub async fn list_files_handler(
    State(state): State<AutomationAppState>,
    headers: HeaderMap,
) -> Result<Json<Value>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let _ = state.auth_service.verify_token(&token)?;

    let files = state.automation_client.list_files().await?;
    Ok(Json(files))
}

pub async fn download_handler(
    State(state): State<AutomationAppState>,
    Path(filename): Path<String>,
) -> Result<Response, AppError> {
    let (resp, clean_name) = state.automation_client.download_file(&filename).await?;

    let content_type = resp
        .headers()
        .get(header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("application/octet-stream")
        .to_string();

    let bytes = resp.bytes().await
        .map_err(|e| AppError::Internal(format!("Falha ao ler bytes do arquivo: {}", e)))?;

    let response = Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, content_type)
        .header(
            header::CONTENT_DISPOSITION,
            HeaderValue::from_str(&format!("attachment; filename=\"{}\"", clean_name))
                .unwrap_or_else(|_| HeaderValue::from_static("attachment")),
        )
        .body(Body::from(bytes))
        .map_err(|e| AppError::Internal(e.to_string()))?;

    Ok(response)
}
