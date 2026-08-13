import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Activity, Users, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export const CadastrosManager = () => {
  const {
    hospitais, addHospital, updateHospital, deleteHospital,
    procedimentos, addProcedimento, updateProcedimento, deleteProcedimento,
    pacientes, addPaciente, updatePaciente, deletePaciente
  } = useApp();

  const [activeSubtab, setActiveSubtab] = useState('hospitais');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [hospForm, setHospForm] = useState({
    nome: '', cidade: '', diariaHospitalar: 0, estimativaHoras: 5, valorHoraExcedente: 1000, observacaoInternacao: ''
  });

  const [procForm, setProcForm] = useState({
    nome: '', descricaoEquipe: '', valorEquipeVista: 0, valorEquipeCartao: 0,
    anestesiaHonorarios: 0, kitPosOperatorioValor: 0, kitPosOperatorioItens: '',
    seguroCirurgia: 0, gastosExtras: ''
  });

  const [pacForm, setPacForm] = useState({
    nome: '', cpf: '', telefone: '', cidade: ''
  });

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (activeSubtab === 'hospitais') {
      if (item) {
        setHospForm(item);
      } else {
        setHospForm({ nome: '', cidade: 'Cascavel/PR', diariaHospitalar: 5000, estimativaHoras: 5, valorHoraExcedente: 1000, observacaoInternacao: '' });
      }
    } else if (activeSubtab === 'procedimentos') {
      if (item) {
        setProcForm({
          ...item,
          kitPosOperatorioItens: Array.isArray(item.kitPosOperatorioItens) ? item.kitPosOperatorioItens.join('\n') : item.kitPosOperatorioItens,
          gastosExtras: Array.isArray(item.gastosExtras) ? item.gastosExtras.join('\n') : item.gastosExtras
        });
      } else {
        setProcForm({
          nome: '',
          descricaoEquipe: '(Inclui cirurgião plástico principal, cirurgião auxiliar e instrumentador cirúrgico)',
          valorEquipeVista: 15000,
          valorEquipeCartao: 17000,
          anestesiaHonorarios: 4000,
          kitPosOperatorioValor: 1200,
          kitPosOperatorioItens: 'Dois macacões cirúrgicos pós-operatórios\nUm par de meias antitrombo',
          seguroCirurgia: 700,
          gastosExtras: 'Drenagem linfática: não inclusa'
        });
      }
    } else if (activeSubtab === 'pacientes') {
      if (item) {
        setPacForm(item);
      } else {
        setPacForm({ nome: '', cpf: '', telefone: '', cidade: 'Cascavel/PR' });
      }
    }
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (activeSubtab === 'hospitais') {
      if (editingItem) {
        updateHospital(editingItem.id, hospForm);
      } else {
        addHospital(hospForm);
      }
    } else if (activeSubtab === 'procedimentos') {
      const formattedProc = {
        ...procForm,
        kitPosOperatorioItens: procForm.kitPosOperatorioItens.split('\n').filter(i => i.trim()),
        gastosExtras: procForm.gastosExtras.split('\n').filter(i => i.trim())
      };
      if (editingItem) {
        updateProcedimento(editingItem.id, formattedProc);
      } else {
        addProcedimento(formattedProc);
      }
    } else if (activeSubtab === 'pacientes') {
      if (editingItem) {
        updatePaciente(editingItem.id, pacForm);
      } else {
        addPaciente(pacForm);
      }
    }
    setModalOpen(false);
  };

  const formatMoney = (val) => (parseFloat(val) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <div className="cadastros-container">
      <div className="cadastros-subtabs">
        <button
          className={`subtab-btn ${activeSubtab === 'hospitais' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('hospitais')}
        >
          <Building2 size={18} />
          <span>Hospitais ({hospitais.length})</span>
        </button>

        <button
          className={`subtab-btn ${activeSubtab === 'procedimentos' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('procedimentos')}
        >
          <Activity size={18} />
          <span>Procedimentos ({procedimentos.length})</span>
        </button>

        <button
          className={`subtab-btn ${activeSubtab === 'pacientes' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('pacientes')}
        >
          <Users size={18} />
          <span>Pacientes ({pacientes.length})</span>
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Gerenciar {activeSubtab === 'hospitais' ? 'Hospitais' : activeSubtab === 'procedimentos' ? 'Procedimentos' : 'Pacientes'}</h3>
        <button className="btn-action btn-success" onClick={() => handleOpenModal(null)}>
          <Plus size={16} />
          <span>Novo {activeSubtab === 'hospitais' ? 'Hospital' : activeSubtab === 'procedimentos' ? 'Procedimento' : 'Paciente'}</span>
        </button>
      </div>

      {/* ITEMS LIST */}
      <div className="items-grid">
        {activeSubtab === 'hospitais' && hospitais.map(hosp => (
          <div className="item-card" key={hosp.id}>
            <div>
              <div className="item-card-header">
                <h4>{hosp.nome}</h4>
                <div className="item-card-actions">
                  <button className="icon-btn" onClick={() => handleOpenModal(hosp)} title="Editar"><Edit2 size={16} /></button>
                  <button className="icon-btn btn-delete" onClick={() => deleteHospital(hosp.id)} title="Excluir"><Trash2 size={16} /></button>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Cidade: {hosp.cidade}</p>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#0284c7', marginTop: '6px' }}>Diária: R$ {formatMoney(hosp.diariaHospitalar)}</p>
              {hosp.valorHoraExcedente > 0 && (
                <p style={{ fontSize: '12px', color: '#64748b' }}>Hora Excedente: R$ {formatMoney(hosp.valorHoraExcedente)}</p>
              )}
            </div>
          </div>
        ))}

        {activeSubtab === 'procedimentos' && procedimentos.map(proc => (
          <div className="item-card" key={proc.id}>
            <div>
              <div className="item-card-header">
                <h4>{proc.nome}</h4>
                <div className="item-card-actions">
                  <button className="icon-btn" onClick={() => handleOpenModal(proc)} title="Editar"><Edit2 size={16} /></button>
                  <button className="icon-btn btn-delete" onClick={() => deleteProcedimento(proc.id)} title="Excluir"><Trash2 size={16} /></button>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b' }}>{proc.descricaoEquipe}</p>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669', marginTop: '6px' }}>
                Equipe à Vista: R$ {formatMoney(proc.valorEquipeVista)}
              </p>
              <p style={{ fontSize: '13px', color: '#0284c7' }}>Anestesia: R$ {formatMoney(proc.anestesiaHonorarios)}</p>
            </div>
          </div>
        ))}

        {activeSubtab === 'pacientes' && pacientes.map(pac => (
          <div className="item-card" key={pac.id}>
            <div>
              <div className="item-card-header">
                <h4>{pac.nome}</h4>
                <div className="item-card-actions">
                  <button className="icon-btn" onClick={() => handleOpenModal(pac)} title="Editar"><Edit2 size={16} /></button>
                  <button className="icon-btn btn-delete" onClick={() => deletePaciente(pac.id)} title="Excluir"><Trash2 size={16} /></button>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b' }}>CPF: {pac.cpf || 'Não informado'}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Telefone: {pac.telefone || 'Não informado'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingItem ? 'Editar' : 'Novo'} {activeSubtab === 'hospitais' ? 'Hospital' : activeSubtab === 'procedimentos' ? 'Procedimento' : 'Paciente'}</h3>
              <button className="icon-btn" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                {activeSubtab === 'hospitais' && (
                  <>
                    <div className="form-group">
                      <label>Nome do Hospital</label>
                      <input type="text" className="input-control" value={hospForm.nome} onChange={e => setHospForm({ ...hospForm, nome: e.target.value })} required />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label>Cidade/UF</label>
                        <input type="text" className="input-control" value={hospForm.cidade} onChange={e => setHospForm({ ...hospForm, cidade: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Diária Hospitalar (R$)</label>
                        <input type="number" step="0.01" className="input-control" value={hospForm.diariaHospitalar} onChange={e => setHospForm({ ...hospForm, diariaHospitalar: parseFloat(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Observação de Internação Padrão</label>
                      <textarea className="input-control" rows="3" value={hospForm.observacaoInternacao} onChange={e => setHospForm({ ...hospForm, observacaoInternacao: e.target.value })}></textarea>
                    </div>
                  </>
                )}

                {activeSubtab === 'procedimentos' && (
                  <>
                    <div className="form-group">
                      <label>Nome do Procedimento</label>
                      <input type="text" className="input-control" value={procForm.nome} onChange={e => setProcForm({ ...procForm, nome: e.target.value })} required />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label>Valor Equipe à Vista (R$)</label>
                        <input type="number" step="0.01" className="input-control" value={procForm.valorEquipeVista} onChange={e => setProcForm({ ...procForm, valorEquipeVista: parseFloat(e.target.value) || 0 })} />
                      </div>
                      <div className="form-group">
                        <label>Valor Equipe Cartão (R$)</label>
                        <input type="number" step="0.01" className="input-control" value={procForm.valorEquipeCartao} onChange={e => setProcForm({ ...procForm, valorEquipeCartao: parseFloat(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label>Honorários Anestésicos (R$)</label>
                        <input type="number" step="0.01" className="input-control" value={procForm.anestesiaHonorarios} onChange={e => setProcForm({ ...procForm, anestesiaHonorarios: parseFloat(e.target.value) || 0 })} />
                      </div>
                      <div className="form-group">
                        <label>Kit Pós-Operatório (R$)</label>
                        <input type="number" step="0.01" className="input-control" value={procForm.kitPosOperatorioValor} onChange={e => setProcForm({ ...procForm, kitPosOperatorioValor: parseFloat(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Itens do Kit Pós-Operatório (1 por linha)</label>
                      <textarea className="input-control" rows="2" value={procForm.kitPosOperatorioItens} onChange={e => setProcForm({ ...procForm, kitPosOperatorioItens: e.target.value })}></textarea>
                    </div>
                  </>
                )}

                {activeSubtab === 'pacientes' && (
                  <>
                    <div className="form-group">
                      <label>Nome Completo do Paciente</label>
                      <input type="text" className="input-control" value={pacForm.nome} onChange={e => setPacForm({ ...pacForm, nome: e.target.value })} required />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label>CPF</label>
                        <input type="text" className="input-control" value={pacForm.cpf} onChange={e => setPacForm({ ...pacForm, cpf: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Telefone / WhatsApp</label>
                        <input type="text" className="input-control" value={pacForm.telefone} onChange={e => setPacForm({ ...pacForm, telefone: e.target.value })} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-action" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-action btn-success">Salvar Cadastro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
