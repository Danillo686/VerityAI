from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class DocxRequest(BaseModel):
    title: str = Field(..., min_length=1, description="Título do documento")
    content: str = Field(..., min_length=1, description="Texto ou tópicos do documento")
    filename: Optional[str] = Field("documento_verity.docx", description="Nome do arquivo")
    author: Optional[str] = Field("Verity AI", description="Autor")
    mode: Optional[str] = Field("empresa", description="empresa ou normal")
    template_style: Optional[str] = Field("corporativo", description="corporativo, formal ou simples")

class XlsxRequest(BaseModel):
    filename: Optional[str] = Field("planilha_verity.xlsx", description="Nome do arquivo")
    sheet_name: Optional[str] = Field("Dados", description="Nome da aba")
    title: Optional[str] = Field("Relatório Financeiro & Operacional", description="Título no cabeçalho")
    headers: List[str] = Field(..., min_length=1, description="Cabeçalhos das colunas")
    rows: List[List[Any]] = Field(..., description="Linhas com dados")
    include_summary_row: bool = Field(True, description="Incluir linha de totais/médias se numérico")

class PdfSection(BaseModel):
    heading: str
    text: str

class PdfRequest(BaseModel):
    title: str = Field(..., min_length=1, description="Título do relatório")
    subtitle: Optional[str] = Field("Relatório Executivo Automatizado", description="Subtítulo")
    content: Optional[str] = Field("", description="Conteúdo geral ou resumo")
    sections: Optional[List[PdfSection]] = Field(default_factory=list, description="Seções detalhadas")
    filename: Optional[str] = Field("relatorio_verity.pdf", description="Nome do arquivo")
    author: Optional[str] = Field("Verity AI Systems", description="Autor ou empresa")

class EmailRequest(BaseModel):
    recipient: str = Field(..., description="E-mail de destino")
    subject: str = Field(..., min_length=1, description="Assunto do e-mail")
    body: str = Field(..., min_length=1, description="Mensagem")
    sender_name: Optional[str] = Field("Verity AI Assistant", description="Nome de exibição")
    is_preview: bool = Field(False, description="Apenas gerar pré-visualização")
    confirm: bool = Field(False, description="Confirmação explícita de envio")

class FinancialCalcInputs(BaseModel):
    revenue: float = Field(0.0, description="Receita bruta total")
    costs: float = Field(0.0, description="Custos de produtos ou serviços (CPV)")
    operating_expenses: float = Field(0.0, description="Despesas operacionais e administrativas")
    tax_rate: Optional[float] = Field(15.0, description="Alíquota estimada de impostos (%)")
    initial_investment: Optional[float] = Field(0.0, description="Investimento inicial (para ROI)")
    expected_gain: Optional[float] = Field(0.0, description="Ganho/Retorno estimado (para ROI)")

class CalculationRequest(BaseModel):
    calc_type: str = Field("financial", description="financial, roi, or cashflow")
    inputs: FinancialCalcInputs
    generate_report: bool = Field(True, description="Gerar texto explicativo detalhado")

class FileOrganizeRequest(BaseModel):
    target_directory: str = Field(..., description="Caminho do diretório autorizado")
    rule: str = Field("by_extension", description="by_extension ou by_type")
    is_preview: bool = Field(True, description="Apenas simular e retornar ações previstas")
    confirm: bool = Field(False, description="Confirmação explícita para executar movimentação")
