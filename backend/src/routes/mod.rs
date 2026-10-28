pub mod auth_routes;
pub mod automation_routes;
pub mod chat_routes;
pub mod task_routes;

use axum::{
    routing::{get, post, put},
    Router,
};
use std::sync::Arc;
use crate::db::DbPool;
use crate::services::ai_service::AiService;
use crate::services::auth_service::AuthService;
use crate::services::automation_client::AutomationClient;
use automation_routes::AutomationAppState;

pub fn create_router(
    db: DbPool,
    auth_service: Arc<AuthService>,
    ai_service: Arc<AiService>,
    automation_client: Arc<AutomationClient>,
) -> Router {
    // Auth routes
    let auth_router = Router::new()
        .route("/register", post(auth_routes::register_handler))
        .route("/login", post(auth_routes::login_handler))
        .route("/me", get(auth_routes::get_me_handler))
        .route("/me", put(auth_routes::update_me_handler))
        .with_state(auth_service.clone())
        .layer(axum::Extension(db.clone()));

    // Chat routes
    let chat_router = Router::new()
        .route("/message", post(chat_routes::send_message_handler))
        .with_state((ai_service.clone(), auth_service.clone()))
        .route("/history", get(chat_routes::get_chat_history_handler))
        .with_state((db.clone(), auth_service.clone()));

    // Task routes
    let task_router = Router::new()
        .route("/", get(task_routes::list_tasks_handler))
        .route("/", post(task_routes::create_task_handler))
        .with_state((db.clone(), auth_service.clone()));

    // Automation routes
    let automation_state = AutomationAppState {
        automation_client: automation_client.clone(),
        auth_service: auth_service.clone(),
        db: db.clone(),
    };

    let automation_router = Router::new()
        .route("/health", get(automation_routes::health_handler))
        .route("/docx", post(automation_routes::generate_docx_handler))
        .route("/xlsx", post(automation_routes::generate_xlsx_handler))
        .route("/pdf", post(automation_routes::generate_pdf_handler))
        .route("/email", post(automation_routes::send_email_handler))
        .route("/calc", post(automation_routes::calculate_handler))
        .route("/files/organize", post(automation_routes::organize_files_handler))
        .route("/files", get(automation_routes::list_files_handler))
        .route("/download/:filename", get(automation_routes::download_handler))
        .with_state(automation_state);

    // Root /api router
    Router::new()
        .nest("/api/auth", auth_router)
        .nest("/api/chat", chat_router)
        .nest("/api/tasks", task_router)
        .nest("/api/automation", automation_router)
}
