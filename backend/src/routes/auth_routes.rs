use axum::{
    extract::{Extension, State},
    http::HeaderMap,
    Json,
};
use std::sync::Arc;
use serde_json::json;
use crate::error::AppError;
use crate::models::user::{AuthResponse, LoginRequest, RegisterRequest, UpdateProfileRequest, UserDto};
use crate::services::auth_service::AuthService;

pub async fn register_handler(
    State(auth_service): State<Arc<AuthService>>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    let res = auth_service.register(payload)?;
    Ok(Json(res))
}

pub async fn login_handler(
    State(auth_service): State<Arc<AuthService>>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    let res = auth_service.login(payload)?;
    Ok(Json(res))
}

pub async fn get_me_handler(
    State(auth_service): State<Arc<AuthService>>,
    headers: HeaderMap,
) -> Result<Json<UserDto>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = auth_service.verify_token(&token)?;
    let user = auth_service.get_user_profile(&claims.sub)?;
    Ok(Json(user))
}

pub async fn update_me_handler(
    State(auth_service): State<Arc<AuthService>>,
    Extension(db): Extension<crate::db::DbPool>,
    headers: HeaderMap,
    Json(payload): Json<UpdateProfileRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    let token = extract_bearer_token(&headers)?;
    let claims = auth_service.verify_token(&token)?;
    
    db.update_user_profile(
        &claims.sub,
        payload.name.as_deref(),
        payload.default_mode.as_deref(),
        payload.plan.as_deref(),
    )?;

    let user = auth_service.get_user_profile(&claims.sub)?;

    Ok(Json(json!({
        "success": true,
        "message": "Perfil atualizado com sucesso.",
        "user": user
    })))
}

pub fn extract_bearer_token(headers: &HeaderMap) -> Result<String, AppError> {
    let auth_header = headers
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| AppError::Unauthorized("Cabeçalho de autorização ausente.".to_string()))?;

    if let Some(token) = auth_header.strip_prefix("Bearer ") {
        Ok(token.trim().to_string())
    } else {
        Err(AppError::Unauthorized("Formato de token inválido. Esperado 'Bearer <token>'.".to_string()))
    }
}
