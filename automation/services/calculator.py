from typing import Dict, Any
from models.schemas import CalculationRequest

def perform_calculations(req: CalculationRequest) -> Dict[str, Any]:
    inp = req.inputs
    revenue = inp.revenue
    costs = inp.costs
    opex = inp.operating_expenses
    tax_rate = inp.tax_rate or 0.0

    # Financial analysis
    gross_profit = revenue - costs
    gross_margin = (gross_profit / revenue * 100) if revenue > 0 else 0.0
    operating_profit = gross_profit - opex
    operating_margin = (operating_profit / revenue * 100) if revenue > 0 else 0.0

    taxes = max(0.0, operating_profit * (tax_rate / 100.0)) if operating_profit > 0 else 0.0
    net_profit = operating_profit - taxes
    net_margin = (net_profit / revenue * 100) if revenue > 0 else 0.0

    # ROI analysis if provided
    roi_percentage = 0.0
    if inp.initial_investment and inp.initial_investment > 0:
        gain = inp.expected_gain or net_profit
        roi_percentage = ((gain - inp.initial_investment) / inp.initial_investment) * 100.0

    # Administrative narrative synthesis
    report_text = f"""### Relatório de Análise Financeira e Operacional

**1. Desempenho de Receita e Margem Bruta**
- Receita Total Informada: R$ {revenue:,.2f}
- Custos Diretos (CPV/CMV): R$ {costs:,.2f}
- Lucro Bruto: R$ {gross_profit:,.2f} (Margem Bruta de {gross_margin:.1f}%)

**2. Eficiência Operacional e Despesas**
- Despesas Operacionais: R$ {opex:,.2f}
- Lucro Operacional (EBITDA aproximado): R$ {operating_profit:,.2f} (Margem Operacional de {operating_margin:.1f}%)

**3. Resultado Líquido Projetado**
- Provisão de Tributos ({tax_rate:.1f}%): R$ {taxes:,.2f}
- Lucro Líquido Final: R$ {net_profit:,.2f} (Margem Líquida de {net_margin:.1f}%)
"""
    if inp.initial_investment and inp.initial_investment > 0:
        report_text += f"""
**4. Retorno sobre Investimento (ROI)**
- Investimento Inicial: R$ {inp.initial_investment:,.2f}
- Retorno Estimado Calculado: {roi_percentage:+.1f}%
"""

    report_text += """
*Aviso Legal: Estes cálculos e simulações são ferramentas analíticas operacionais e não constituem parecer contábil, auditoria fiscal ou recomendação financeira profissional oficial.*
"""

    return {
        "success": True,
        "metrics": {
            "revenue": revenue,
            "costs": costs,
            "gross_profit": round(gross_profit, 2),
            "gross_margin_percent": round(gross_margin, 2),
            "operating_expenses": opex,
            "operating_profit": round(operating_profit, 2),
            "operating_margin_percent": round(operating_margin, 2),
            "estimated_taxes": round(taxes, 2),
            "net_profit": round(net_profit, 2),
            "net_margin_percent": round(net_margin, 2),
            "roi_percent": round(roi_percentage, 2) if inp.initial_investment else None
        },
        "report_summary": report_text.strip(),
        "disclaimer": "Simulação demonstrativa para suporte à gestão; não substitui parecer contábil profissional."
    }
