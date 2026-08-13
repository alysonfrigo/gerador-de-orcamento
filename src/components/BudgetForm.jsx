import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Building2, Activity, DollarSign, Calendar, FileText, CheckCircle2, RotateCcw } from 'lucide-react';

export const BudgetForm = () => {
  const {
    currentOrcamento,
    setCurrentOrcamento,
    resetCurrentOrcamento,
    pacientes,
    hospitais,
    procedimentos,
    selectPacienteForBudget,
    selectHospitalForBudget,
    selectProcedimentoForBudget
  } = useApp();

  const handleFieldChange = (field, value) => {
    setCurrentOrcamento(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="editor-body">
      {/* SELEÇÃO RÁPIDA DE CADASTROS */}
      <div className="section-group">
        <div className="section-group-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} />
            <span>Seleção de Cadastros (Hospital, Paciente & Procedimento)</span>
          </div>

          <button className="icon-btn" onClick={resetCurrentOrcamento} title="Limpar Campos e Começar Novo">
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label style={{ color: !currentOrcamento.hospitalId ? '#dc2626' : 'inherit' }}>
              1. Hospital * {!currentOrcamento.hospitalId && '(Obrigatório)'}
            </label>
            <select
              className="input-control"
              style={{ borderColor: !currentOrcamento.hospitalId ? '#fca5a5' : '' }}
              value={currentOrcamento.hospitalId || ''}
              onChange={(e) => selectHospitalForBudget(e.target.value)}
            >
              <option value="">-- Selecione o Hospital --</option>
              {hospitais.map(hosp => (
                <option key={hosp.id} value={hosp.id}>{hosp.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ color: !currentOrcamento.pacienteId ? '#dc2626' : 'inherit' }}>
              2. Paciente * {!currentOrcamento.pacienteId && '(Obrigatório)'}
            </label>
            <select
              className="input-control"
              style={{ borderColor: !currentOrcamento.pacienteId ? '#fca5a5' : '' }}
              value={currentOrcamento.pacienteId || ''}
              onChange={(e) => selectPacienteForBudget(e.target.value)}
            >
              <option value="">-- Selecione o Paciente --</option>
              {pacientes.map(pac => (
                <option key={pac.id} value={pac.id}>{pac.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ color: !currentOrcamento.procedimentoId ? '#dc2626' : 'inherit' }}>
              3. Procedimento * {!currentOrcamento.procedimentoId && '(Obrigatório)'}
            </label>
            <select
              className="input-control"
              style={{ borderColor: !currentOrcamento.procedimentoId ? '#fca5a5' : '' }}
              value={currentOrcamento.procedimentoId || ''}
              onChange={(e) => selectProcedimentoForBudget(e.target.value)}
            >
              <option value="">-- Selecione o Procedimento --</option>
              {procedimentos.map(proc => (
                <option key={proc.id} value={proc.id}>{proc.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DADOS DO CABEÇALHO */}
      <div className="section-group">
        <div className="section-group-title">
          <FileText size={16} />
          <span>Informações da Proposta</span>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Nome do Paciente no Documento</label>
            <input
              type="text"
              className="input-control"
              placeholder="Digite ou selecione um paciente acima..."
              value={currentOrcamento.pacienteNome || ''}
              onChange={(e) => handleFieldChange('pacienteNome', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Cidade e Data (Por extenso)</label>
            <input
              type="text"
              className="input-control"
              value={currentOrcamento.cidadeData || ''}
              onChange={(e) => handleFieldChange('cidadeData', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* VALORES E OBSERVAÇÕES */}
      <div className="section-group">
        <div className="section-group-title">
          <DollarSign size={16} />
          <span>Internação Hospitalar & Anestesiologia</span>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Diária Hospitalar (R$) - Customizável</label>
            <input
              type="number"
              step="0.01"
              className="input-control"
              value={currentOrcamento.diariaHospitalar || 0}
              onChange={(e) => handleFieldChange('diariaHospitalar', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="form-group">
            <label>Honorários Anestésicos (R$)</label>
            <input
              type="number"
              step="0.01"
              className="input-control"
              value={currentOrcamento.anestesiaHonorarios || 0}
              onChange={(e) => handleFieldChange('anestesiaHonorarios', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Observação da Internação Hospitalar</label>
          <textarea
            className="input-control"
            rows="2"
            value={currentOrcamento.observacaoInternacao || ''}
            onChange={(e) => handleFieldChange('observacaoInternacao', e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* EQUIPE CIRÚRGICA */}
      <div className="section-group">
        <div className="section-group-title">
          <Activity size={16} />
          <span>Equipe Cirúrgica</span>
        </div>

        <div className="form-group">
          <label>Descrição da Equipe</label>
          <input
            type="text"
            className="input-control"
            value={currentOrcamento.descricaoEquipe || ''}
            onChange={(e) => handleFieldChange('descricaoEquipe', e.target.value)}
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Pagamento à Vista (R$)</label>
            <input
              type="number"
              step="0.01"
              className="input-control"
              value={currentOrcamento.valorEquipeVista || 0}
              onChange={(e) => handleFieldChange('valorEquipeVista', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="form-group">
            <label>Pagamento no Cartão (R$)</label>
            <input
              type="number"
              step="0.01"
              className="input-control"
              value={currentOrcamento.valorEquipeCartao || 0}
              onChange={(e) => handleFieldChange('valorEquipeCartao', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Texto de Parcelamento Cartão</label>
          <input
            type="text"
            className="input-control"
            value={currentOrcamento.parcelamentoTexto || ''}
            onChange={(e) => handleFieldChange('parcelamentoTexto', e.target.value)}
          />
        </div>
      </div>

      {/* ITENS ADICIONAIS & SEGURO */}
      <div className="section-group">
        <div className="section-group-title">
          <CheckCircle2 size={16} />
          <span>Itens Adicionais e Seguro</span>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Valor do Kit Pós-Operatório (R$)</label>
            <input
              type="number"
              step="0.01"
              className="input-control"
              value={currentOrcamento.kitPosOperatorioValor || 0}
              onChange={(e) => handleFieldChange('kitPosOperatorioValor', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="form-group">
            <label>Seguro Cirurgia (R$)</label>
            <input
              type="number"
              step="0.01"
              className="input-control"
              value={currentOrcamento.seguroCirurgia || 0}
              onChange={(e) => handleFieldChange('seguroCirurgia', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Itens Inclusos no Kit (1 por linha)</label>
          <textarea
            className="input-control"
            rows="3"
            value={currentOrcamento.kitPosOperatorioItens || ''}
            onChange={(e) => handleFieldChange('kitPosOperatorioItens', e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* GASTOS EXTRAS E VALIDADE */}
      <div className="section-group">
        <div className="section-group-title">
          <Calendar size={16} />
          <span>Gastos Extras & Validade da Proposta</span>
        </div>

        <div className="form-group">
          <label>Gastos Extras Não Inclusos (1 item por linha)</label>
          <textarea
            className="input-control"
            rows="3"
            value={currentOrcamento.gastosExtrasTexto || ''}
            onChange={(e) => handleFieldChange('gastosExtrasTexto', e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Validade da Proposta (Dias)</label>
          <input
            type="number"
            className="input-control"
            value={currentOrcamento.validadeDias || 30}
            onChange={(e) => handleFieldChange('validadeDias', parseInt(e.target.value) || 30)}
          />
        </div>
      </div>
    </div>
  );
};
