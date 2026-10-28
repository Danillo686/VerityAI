use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub host: String,
    pub port: u16,
    pub database_url: String,
    pub jwt_secret: String,
    pub automation_service_url: String,
    pub ai_provider: String,
    pub ai_api_key: Option<String>,
}

impl AppConfig {
    pub fn from_env() -> Self {
        let _ = dotenvy::dotenv();

        Self {
            host: env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string()),
            port: env::var("SERVER_PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(8080),
            database_url: env::var("DATABASE_URL").unwrap_or_else(|_| "verity_ai.db".to_string()),
            jwt_secret: env::var("JWT_SECRET").unwrap_or_else(|_| "verity_ai_super_secret_jwt_key_2026_modern".to_string()),
            automation_service_url: env::var("AUTOMATION_URL").unwrap_or_else(|_| "http://127.0.0.1:5001".to_string()),
            ai_provider: env::var("AI_PROVIDER").unwrap_or_else(|_| "demo".to_string()),
            ai_api_key: env::var("AI_API_KEY").ok().filter(|k| !k.trim().is_empty()),
        }
    }
}
