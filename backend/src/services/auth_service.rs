use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use uuid::Uuid;
use crate::error::AppError;
use crate::models::user::{AuthResponse, Claims, LoginRequest, RegisterRequest, User, UserDto};
use crate::db::DbPool;

pub struct AuthService {
    db: DbPool,
    jwt_secret: String,
}

impl AuthService {
    pub fn new(db: DbPool, jwt_secret: String) -> Self {
        Self { db, jwt_secret }
    }

    pub fn register(&self, req: RegisterRequest) -> Result<AuthResponse, AppError> {
        // Validation
        if req.name.trim().is_empty() {
            return Err(AppError::BadRequest("O nome é obrigatório.".to_string()));
        }
        if !req.email.contains('@') || !req.email.contains('.') {
            return Err(AppError::BadRequest("Endereço de e-mail inválido.".to_string()));
        }
        if req.password.len() < 6 {
            return Err(AppError::BadRequest("A senha deve ter no mínimo 6 caracteres.".to_string()));
        }

        // Check duplicate email
        if let Some(_) = self.db.find_user_by_email(&req.email)? {
            return Err(AppError::BadRequest("Este e-mail já está cadastrado.".to_string()));
        }

        // Hash password securely
        let password_hash = bcrypt::hash(&req.password, bcrypt::DEFAULT_COST)
            .map_err(|e| AppError::Internal(format!("Falha ao criptografar senha: {}", e)))?;

        let user = User {
            id: Uuid::new_v4().to_string(),
            name: req.name.trim().to_string(),
            email: req.email.trim().to_lowercase(),
            password_hash,
            plan: req.plan.unwrap_or_else(|| "comum".to_string()),
            default_mode: req.default_mode.unwrap_or_else(|| "normal".to_string()),
            created_at: Utc::now().to_rfc3339(),
        };

        self.db.insert_user(&user)?;

        let token = self.generate_token(&user.id, &user.email)?;

        Ok(AuthResponse {
            success: true,
            token,
            user: user.into(),
        })
    }

    pub fn login(&self, req: LoginRequest) -> Result<AuthResponse, AppError> {
        let user = self.db.find_user_by_email(&req.email)?
            .ok_or_else(|| AppError::Unauthorized("Credenciais inválidas: e-mail ou senha incorretos.".to_string()))?;

        let password_matches = bcrypt::verify(&req.password, &user.password_hash)
            .unwrap_or(false);

        if !password_matches {
            return Err(AppError::Unauthorized("Credenciais inválidas: e-mail ou senha incorretos.".to_string()));
        }

        let token = self.generate_token(&user.id, &user.email)?;

        Ok(AuthResponse {
            success: true,
            token,
            user: user.into(),
        })
    }

    pub fn generate_token(&self, user_id: &str, email: &str) -> Result<String, AppError> {
        let expiration = Utc::now()
            .checked_add_signed(Duration::days(7))
            .expect("valid timestamp")
            .timestamp() as usize;

        let claims = Claims {
            sub: user_id.to_string(),
            email: email.to_string(),
            exp: expiration,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_bytes()),
        ).map_err(|e| AppError::Internal(format!("Falha ao gerar token de autenticação: {}", e)))
    }

    pub fn verify_token(&self, token: &str) -> Result<Claims, AppError> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_bytes()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .map_err(|_| AppError::Unauthorized("Token inválido ou expirado.".to_string()))
    }

    pub fn get_user_profile(&self, user_id: &str) -> Result<UserDto, AppError> {
        let user = self.db.find_user_by_id(user_id)?
            .ok_or_else(|| AppError::NotFound("Usuário não encontrado.".to_string()))?;
        Ok(user.into())
    }
}
