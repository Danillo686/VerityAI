use reqwest::Client;
use serde_json::Value;
use crate::error::AppError;

#[derive(Clone)]
pub struct AutomationClient {
    client: Client,
    base_url: String,
}

impl AutomationClient {
    pub fn new(base_url: String) -> Self {
        Self {
            client: Client::builder()
                .timeout(std::time::Duration::from_secs(30))
                .build()
                .unwrap_or_default(),
            base_url,
        }
    }

    pub async fn check_health(&self) -> Result<Value, AppError> {
        let url = format!("{}/api/v1/health", self.base_url);
        let resp = self.client.get(&url).send().await
            .map_err(|e| AppError::ExternalService(format!("Falha ao conectar ao serviço Python: {}", e)))?;
        
        let json: Value = resp.json().await
            .map_err(|e| AppError::ExternalService(format!("Resposta inválida do serviço Python: {}", e)))?;
        Ok(json)
    }

    pub async fn generate_docx(&self, payload: &Value) -> Result<Value, AppError> {
        let url = format!("{}/api/v1/generate/docx", self.base_url);
        let resp = self.client.post(&url).json(payload).send().await
            .map_err(|e| AppError::ExternalService(format!("Falha na chamada de geração DOCX: {}", e)))?;

        if !resp.status().is_success() {
            let err_txt = resp.text().await.unwrap_or_else(|_| "Erro desconhecido".to_string());
            return Err(AppError::ExternalService(format!("Serviço de automação falhou: {}", err_txt)));
        }

        let json: Value = resp.json().await
            .map_err(|e| AppError::ExternalService(e.to_string()))?;
        Ok(json)
    }

    pub async fn generate_xlsx(&self, payload: &Value) -> Result<Value, AppError> {
        let url = format!("{}/api/v1/generate/xlsx", self.base_url);
        let resp = self.client.post(&url).json(payload).send().await
            .map_err(|e| AppError::ExternalService(format!("Falha na chamada de geração XLSX: {}", e)))?;

        if !resp.status().is_success() {
            let err_txt = resp.text().await.unwrap_or_else(|_| "Erro desconhecido".to_string());
            return Err(AppError::ExternalService(format!("Serviço de automação falhou: {}", err_txt)));
        }

        let json: Value = resp.json().await
            .map_err(|e| AppError::ExternalService(e.to_string()))?;
        Ok(json)
    }

    pub async fn generate_pdf(&self, payload: &Value) -> Result<Value, AppError> {
        let url = format!("{}/api/v1/generate/pdf", self.base_url);
        let resp = self.client.post(&url).json(payload).send().await
            .map_err(|e| AppError::ExternalService(format!("Falha na chamada de geração PDF: {}", e)))?;

        if !resp.status().is_success() {
            let err_txt = resp.text().await.unwrap_or_else(|_| "Erro desconhecido".to_string());
            return Err(AppError::ExternalService(format!("Serviço de automação falhou: {}", err_txt)));
        }

        let json: Value = resp.json().await
            .map_err(|e| AppError::ExternalService(e.to_string()))?;
        Ok(json)
    }

    pub async fn send_email(&self, payload: &Value) -> Result<Value, AppError> {
        let url = format!("{}/api/v1/email/send", self.base_url);
        let resp = self.client.post(&url).json(payload).send().await
            .map_err(|e| AppError::ExternalService(format!("Falha na chamada de envio de e-mail: {}", e)))?;

        let status = resp.status();
        let json: Value = resp.json().await
            .map_err(|e| AppError::ExternalService(e.to_string()))?;

        if !status.is_success() {
            let err_msg = json.get("detail").and_then(|v| v.as_str()).unwrap_or("Falha ao processar e-mail");
            return Err(AppError::BadRequest(err_msg.to_string()));
        }

        Ok(json)
    }

    pub async fn calculate_financial(&self, payload: &Value) -> Result<Value, AppError> {
        let url = format!("{}/api/v1/calc/financial", self.base_url);
        let resp = self.client.post(&url).json(payload).send().await
            .map_err(|e| AppError::ExternalService(format!("Falha na chamada de cálculos financeiros: {}", e)))?;

        if !resp.status().is_success() {
            let err_txt = resp.text().await.unwrap_or_else(|_| "Erro desconhecido".to_string());
            return Err(AppError::ExternalService(err_txt));
        }

        let json: Value = resp.json().await
            .map_err(|e| AppError::ExternalService(e.to_string()))?;
        Ok(json)
    }

    pub async fn organize_files(&self, payload: &Value) -> Result<Value, AppError> {
        let url = format!("{}/api/v1/files/organize", self.base_url);
        let resp = self.client.post(&url).json(payload).send().await
            .map_err(|e| AppError::ExternalService(format!("Falha na chamada de organização de arquivos: {}", e)))?;

        let status = resp.status();
        let json: Value = resp.json().await
            .map_err(|e| AppError::ExternalService(e.to_string()))?;

        if !status.is_success() {
            let err_msg = json.get("detail").and_then(|v| v.as_str()).unwrap_or("Falha na organização");
            return Err(AppError::BadRequest(err_msg.to_string()));
        }

        Ok(json)
    }

    pub async fn download_file(&self, filename: &str) -> Result<(reqwest::Response, String), AppError> {
        let clean = std::path::Path::new(filename)
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("file");

        let url = format!("{}/api/v1/download/{}", self.base_url, clean);
        let resp = self.client.get(&url).send().await
            .map_err(|e| AppError::ExternalService(format!("Falha ao requisitar download: {}", e)))?;

        if !resp.status().is_success() {
            return Err(AppError::NotFound("Arquivo não encontrado no serviço de automação.".to_string()));
        }

        Ok((resp, clean.to_string()))
    }

    pub async fn list_files(&self) -> Result<Value, AppError> {
        let url = format!("{}/api/v1/files/list", self.base_url);
        let resp = self.client.get(&url).send().await
            .map_err(|e| AppError::ExternalService(format!("Falha ao listar arquivos gerados: {}", e)))?;
        let json: Value = resp.json().await
            .map_err(|e| AppError::ExternalService(e.to_string()))?;
        Ok(json)
    }
}
