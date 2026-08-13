import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, FileText, Trash2, ArrowUpRight, Search, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export const HistoricoManager = ({ setActiveTab }) => {
  const { orcamentosSalvos, setCurrentOrcamento, deleteOrcamentoSalvo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ativos'); // 'todos', 'ativos', 'expirados'

  const handleLoadOrcamento = (orc) => {
    setCurrentOrcamento(orc);
    setActiveTab('gerador');
  };

  const formatMoney = (val) => (parseFloat(val) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  // Verificar se orçamento está dentro da validade (dias)
  const getValidityInfo = (orc) => {
    const dataCriacao = new Date(orc.dataCriacao || Date.now());
    const validadeDias = parseInt(orc.validadeDias) || 30;
    const dataExpiracao = new Date(dataCriacao.getTime() + validadeDias * 24 * 60 * 60 * 1000);
    const hoje = new Date();
    const isValido = hoje <= dataExpiracao;

    const diffMs = dataExpiracao.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return { isValido, dataExpiracao, diasRestantes };
  };

  // Filtragem dos orçamentos
  const filteredOrcamentos = orcamentosSalvos.filter(orc => {
    const { isValido } = getValidityInfo(orc);
    
    // Filtro de status
    if (filterStatus === 'ativos' && !isValido) return false;
    if (filterStatus === 'expirados' && isValido) return false;

    // Filtro de busca por nome da pessoa / paciente / procedimento / hospital
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchPaciente = (orc.pacienteNome || '').toLowerCase().includes(term);
      const matchProc = (orc.procedimentoNome || '').toLowerCase().includes(term);
      const matchHosp = (orc.hospitalNome || '').toLowerCase().includes(term);
      return matchPaciente || matchProc || matchHosp;
    }

    return true;
  });

  return (
    <div className="cadastros-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={24} className="text-primary" />
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Histórico de Orçamentos Salvos</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Orçamentos registrados e controle de validade de 30 dias</span>
          </div>
        </div>

        {/* BUSCA POR PESSOAS / NOME */}
        <div className="input-with-icon" style={{ minWidth: '280px' }}>
          <Search />
          <input
            type="text"
            className="input-control"
            placeholder="Buscar por paciente ou procedimento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ABAS DE FILTRO DE STATUS */}
      <div className="nav-tabs" style={{ marginBottom: '20px', width: 'fit-content' }}>
        <button
          className={`nav-tab ${filterStatus === 'ativos' ? 'active' : ''}`}
          onClick={() => setFilterStatus('ativos')}
        >
          <CheckCircle size={15} style={{ color: '#059669' }} />
          <span>Ativos (Válidos)</span>
        </button>

        <button
          className={`nav-tab ${filterStatus === 'todos' ? 'active' : ''}`}
          onClick={() => setFilterStatus('todos')}
        >
          <Clock size={15} />
          <span>Todos ({orcamentosSalvos.length})</span>
        </button>

        <button
          className={`nav-tab ${filterStatus === 'expirados' ? 'active' : ''}`}
          onClick={() => setFilterStatus('expirados')}
        >
          <AlertTriangle size={15} style={{ color: '#dc2626' }} />
          <span>Expirados</span>
        </button>
      </div>

      {filteredOrcamentos.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <FileText size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p style={{ fontWeight: '600' }}>Nenhum orçamento encontrado.</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>
            {searchTerm ? 'Tente alterar a busca de pessoas/pacientes.' : 'Os orçamentos exportados em PDF ou salvos aparecerão aqui.'}
          </p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredOrcamentos.map(orc => {
            const { isValido, diasRestantes } = getValidityInfo(orc);

            const totalVista = (
              (parseFloat(orc.diariaHospitalar) || 0) +
              (parseFloat(orc.anestesiaHonorarios) || 0) +
              (parseFloat(orc.valorEquipeVista) || 0) +
              (parseFloat(orc.kitPosOperatorioValor) || 0) +
              (parseFloat(orc.seguroCirurgia) || 0)
            );

            return (
              <div className="item-card" key={orc.id} style={{ borderLeft: isValido ? '4px solid #059669' : '4px solid #dc2626' }}>
                <div>
                  <div className="item-card-header">
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{orc.pacienteNome || 'Sem Nome'}</h4>
                      <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '12px', background: isValido ? '#dcfce7' : '#fee2e2', color: isValido ? '#15803d' : '#b91c1c', display: 'inline-block', marginTop: '4px' }}>
                        {isValido ? `Ativo (${diasRestantes} dias restantes)` : 'Expirado (Vencido)'}
                      </span>
                    </div>

                    <div className="item-card-actions">
                      <button className="icon-btn btn-delete" onClick={() => deleteOrcamentoSalvo(orc.id)} title="Excluir"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#0284c7', marginTop: '8px' }}>{orc.procedimentoNome}</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{orc.hospitalNome}</p>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#059669', marginTop: '8px' }}>
                    Total à Vista: R$ {formatMoney(totalVista)}
                  </p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                    Data da Proposta: {new Date(orc.dataCriacao || Date.now()).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <button
                  className="btn-action"
                  style={{ width: '100%', marginTop: '14px', justifyContent: 'center' }}
                  onClick={() => handleLoadOrcamento(orc)}
                >
                  <span>Abrir / Reutilizar</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
