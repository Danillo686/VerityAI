mod config;
mod db;
mod error;
mod models;
mod routes;
mod services;

use std::sync::Arc;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::config::AppConfig;
use crate::db::DbPool;
use crate::services::ai_service::AiService;
use crate::services::auth_service::AuthService;
use crate::services::automation_client::AutomationClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "backend=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = AppConfig::from_env();
    tracing::info!("Iniciando Verity AI Backend...");
    tracing::info!("Conectando ao banco de dados: {}", config.database_url);

    // Initialize database pool
    let db = DbPool::new(&config.database_url)?;

    // Initialize services
    let auth_service = Arc::new(AuthService::new(db.clone(), config.jwt_secret.clone()));
    let ai_service = Arc::new(AiService::new(
        db.clone(),
        config.ai_provider.clone(),
        config.ai_api_key.clone(),
    ));
    let automation_client = Arc::new(AutomationClient::new(config.automation_service_url.clone()));

    // Build router
    let app = routes::create_router(db, auth_service, ai_service, automation_client)
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        )
        .layer(TraceLayer::new_for_http());

    let addr: SocketAddr = format!("{}:{}", config.host, config.port).parse()?;
    tracing::info!("Servidor Verity AI ouvindo em http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
