import React from 'react';
import { useApp } from '../context/AppContext';

export const BudgetDocumentPreview = () => {
  const { currentOrcamento } = useApp();

  const formatMoney = (val) => {
    const num = parseFloat(val) || 0;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Cálculo automático do total estimado à vista
  const totalVista = (
    (parseFloat(currentOrcamento.diariaHospitalar) || 0) +
    (parseFloat(currentOrcamento.anestesiaHonorarios) || 0) +
    (parseFloat(currentOrcamento.valorEquipeVista) || 0) +
    (parseFloat(currentOrcamento.kitPosOperatorioValor) || 0) +
    (parseFloat(currentOrcamento.seguroCirurgia) || 0)
  );

  // Total no cartão
  const totalCartao = (
    (parseFloat(currentOrcamento.diariaHospitalar) || 0) +
    (parseFloat(currentOrcamento.anestesiaHonorarios) || 0) +
    (parseFloat(currentOrcamento.valorEquipeCartao) || 0) +
    (parseFloat(currentOrcamento.kitPosOperatorioValor) || 0) +
    (parseFloat(currentOrcamento.seguroCirurgia) || 0)
  );

  // Parse dos itens do kit e gastos extras
  const kitItems = currentOrcamento.kitPosOperatorioItens
    ? currentOrcamento.kitPosOperatorioItens.split('\n').filter(i => i.trim() !== '')
    : [];

  const extrasItems = currentOrcamento.gastosExtrasTexto
    ? currentOrcamento.gastosExtrasTexto.split('\n').filter(i => i.trim() !== '')
    : [];

  return (
    <div className="preview-body-container">
      <div id="document-preview-printable" className="document-sheet">
        {/* Cabeçalho */}
        <h1 className="doc-title-main">PROPOSTA DE ORÇAMENTO – PROCEDIMENTO CIRÚRGICO</h1>
        
        <div className="doc-header-info">
          <p>
            <strong>Procedimento proposto:</strong>{' '}
            {currentOrcamento.procedimentoNome ? (
              currentOrcamento.procedimentoNome
            ) : (
              <span style={{ color: '#dc2626', fontStyle: 'italic' }}>[Selecione um Procedimento]</span>
            )}
          </p>
          <p>
            <strong>Paciente:</strong>{' '}
            {currentOrcamento.pacienteNome ? (
              currentOrcamento.pacienteNome
            ) : (
              <span style={{ color: '#dc2626', fontStyle: 'italic' }}>[Selecione um Paciente]</span>
            )}
          </p>
          <p>
            <strong>Local:</strong>{' '}
            {currentOrcamento.hospitalNome ? (
              currentOrcamento.hospitalNome
            ) : (
              <span style={{ color: '#dc2626', fontStyle: 'italic' }}>[Selecione um Hospital]</span>
            )}
          </p>
          <p><strong>Data:</strong> {currentOrcamento.cidadeData || '---'}</p>
        </div>

        <div className="doc-divider"></div>

        {/* 1. Valores Referentes ao Procedimento */}
        <h2 className="doc-section-heading">1. Valores referentes ao procedimento</h2>
        
        <div className="doc-item-row" style={{ marginTop: '10px' }}>
          <div className="doc-item-title">Internação Hospitalar</div>
          <p>• Diária hospitalar: R$ {formatMoney(currentOrcamento.diariaHospitalar)}</p>
          <p style={{ fontWeight: 'bold' }}>Total Hospital: R$ {formatMoney(currentOrcamento.diariaHospitalar)}</p>
          {currentOrcamento.observacaoInternacao && (
            <div className="doc-highlight-box">
              <strong>Observação:</strong> {currentOrcamento.observacaoInternacao}
            </div>
          )}
        </div>

        <div className="doc-divider-thin"></div>

        <div className="doc-item-row">
          <div className="doc-item-title">Equipe de Anestesiologia</div>
          <p>• Honorários anestésicos: R$ {formatMoney(currentOrcamento.anestesiaHonorarios)}</p>
          <p style={{ fontWeight: 'bold' }}>Total Anestesia: R$ {formatMoney(currentOrcamento.anestesiaHonorarios)}</p>
        </div>

        <div className="doc-divider-thin"></div>

        <div className="doc-item-row">
          <div className="doc-item-title">Equipe Cirúrgica</div>
          {currentOrcamento.descricaoEquipe && (
            <p style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
              {currentOrcamento.descricaoEquipe}
            </p>
          )}
          <p><strong>Pagamento à vista</strong></p>
          <p>• Transferência bancária ou dinheiro: R$ {formatMoney(currentOrcamento.valorEquipeVista)}</p>
          <p style={{ marginTop: '4px' }}><strong>Pagamento no cartão de crédito</strong></p>
          <p>• Total: R$ {formatMoney(currentOrcamento.valorEquipeCartao)}</p>
          <p>Parcelamento:</p>
          <p>• {currentOrcamento.parcelamentoTexto}</p>
        </div>

        <div className="doc-divider-thin"></div>

        <div className="doc-item-row">
          <div className="doc-item-title">Itens adicionais</div>
          <p>• Kit pós-operatório: R$ {formatMoney(currentOrcamento.kitPosOperatorioValor)}</p>
          {kitItems.length > 0 && (
            <>
              <p style={{ marginLeft: '12px' }}>Inclui:</p>
              <ul className="doc-bullet-list" style={{ marginLeft: '24px' }}>
                {kitItems.map((item, idx) => (
                  <li key={idx}>{item.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            </>
          )}
          <p style={{ marginTop: '4px' }}>• Seguro cirurgia: R$ {formatMoney(currentOrcamento.seguroCirurgia)}</p>
        </div>

        <div className="doc-divider"></div>

        {/* 2. Valor Total da Cirurgia */}
        <h2 className="doc-section-heading">2. Valor total da cirurgia</h2>
        <p>O valor total corresponde à soma dos seguintes itens:</p>
        <ul className="doc-bullet-list">
          <li>Internação hospitalar</li>
          <li>Equipe de anestesiologia</li>
          <li>Equipe cirúrgica</li>
          <li>Kit pós-operatório</li>
          <li>Seguro Cirurgia</li>
        </ul>

        <div className="doc-total-box">
          <div>Valor total estimado à vista: R$ {formatMoney(totalVista)}</div>
          {parseFloat(currentOrcamento.valorEquipeCartao) > 0 && (
            <div style={{ fontSize: '13px', fontWeight: 'normal', color: '#4b5563', marginTop: '4px' }}>
              Valor total estimado no cartão de crédito: R$ {formatMoney(totalCartao)}
            </div>
          )}
        </div>

        {currentOrcamento.observacoesTotais && (
          <p style={{ fontSize: '13px', fontStyle: 'italic', marginBottom: '10px' }}>
            <strong>Observação:</strong> {currentOrcamento.observacoesTotais}
          </p>
        )}

        <div className="doc-divider"></div>

        {/* 3. Formas de Pagamento */}
        <h2 className="doc-section-heading">3. Formas de pagamento</h2>
        
        <div style={{ marginBottom: '8px' }}>
          <div className="doc-item-title">Internação Hospitalar</div>
          <p>{currentOrcamento.formasPagamento?.internacao}</p>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <div className="doc-item-title">Equipe de Anestesiologia</div>
          <p>{currentOrcamento.formasPagamento?.anestesia}</p>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <div className="doc-item-title">Equipe Cirúrgica</div>
          <p style={{ whiteSpace: 'pre-line' }}>{currentOrcamento.formasPagamento?.equipe}</p>
        </div>

        <div className="doc-divider"></div>

        {/* 4. Gastos Extras */}
        <h2 className="doc-section-heading">4. Gastos extras (não inclusos no valor da cirurgia)</h2>
        {extrasItems.length > 0 ? (
          <ul className="doc-bullet-list">
            {extrasItems.map((item, idx) => (
              <li key={idx}>{item.replace(/^•\s*/, '')}</li>
            ))}
          </ul>
        ) : (
          <p>• Nenhum gasto extra adicional informado.</p>
        )}

        <div className="doc-divider"></div>

        {/* 5. Validade da Proposta */}
        <h2 className="doc-section-heading">5. Validade da proposta</h2>
        <p>Esta proposta possui validade de <strong>{currentOrcamento.validadeDias || 30} dias</strong>.</p>
      </div>
    </div>
  );
};
