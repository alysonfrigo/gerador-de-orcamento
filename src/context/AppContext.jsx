import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialHospitais, initialProcedimentos, initialPacientes, initialFormasPagamentoDefinidas } from '../data/initialData';

const AppContext = createContext();

export const getEmptyOrcamento = () => ({
  id: null,
  procedimentoId: '',
  procedimentoNome: '',
  pacienteId: '',
  pacienteNome: '',
  hospitalId: '',
  hospitalNome: '',
  cidadeData: `Cascavel, ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
  
  diariaHospitalar: 0,
  observacaoInternacao: '',
  
  anestesiaHonorarios: 0,
  observacaoAnestesia: 'Pagamento realizado diretamente à equipe de anestesia, no dia da consulta pré anestésica ou até um dia antes da cirurgia.',
  
  descricaoEquipe: '',
  valorEquipeVista: 0,
  valorEquipeCartao: 0,
  parcelamentoTexto: 'Conforme condições e taxas da operadora do cartão.',
  
  kitPosOperatorioValor: 0,
  kitPosOperatorioItens: '',
  seguroCirurgia: 0,
  
  observacoesTotais: 'Possíveis alterações no tempo cirúrgico e/ou no período de internação podem gerar ajustes nos valores cobrados pelo hospital e pela equipe de anestesiologia.',
  
  formasPagamento: initialFormasPagamentoDefinidas,
  
  gastosExtrasTexto: '',
  validadeDias: 30
});

export const AppProvider = ({ children }) => {
  // Autenticação
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('orcamento_app_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Cadastros
  const [hospitais, setHospitais] = useState(() => {
    const saved = localStorage.getItem('orcamento_app_hospitais');
    return saved ? JSON.parse(saved) : initialHospitais;
  });

  const [procedimentos, setProcedimentos] = useState(() => {
    const saved = localStorage.getItem('orcamento_app_procedimentos');
    return saved ? JSON.parse(saved) : initialProcedimentos;
  });

  const [pacientes, setPacientes] = useState(() => {
    const saved = localStorage.getItem('orcamento_app_pacientes');
    return saved ? JSON.parse(saved) : initialPacientes;
  });

  const [orcamentosSalvos, setOrcamentosSalvos] = useState(() => {
    const saved = localStorage.getItem('orcamento_app_historico');
    return saved ? JSON.parse(saved) : [];
  });

  // Carregar dados da API Backend se disponível
  useEffect(() => {
    fetch('/api/hospitais')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && data.length > 0) setHospitais(data); })
      .catch(() => {});

    fetch('/api/procedimentos')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && data.length > 0) setProcedimentos(data); })
      .catch(() => {});

    fetch('/api/pacientes')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && data.length > 0) setPacientes(data); })
      .catch(() => {});

    fetch('/api/orcamentos')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setOrcamentosSalvos(data); })
      .catch(() => {});
  }, []);

  // Estado do Orçamento em Edição (Começa Vazio conforme solicitado)
  const [currentOrcamento, setCurrentOrcamento] = useState(getEmptyOrcamento());

  const resetCurrentOrcamento = () => {
    setCurrentOrcamento(getEmptyOrcamento());
  };

  // LocalStorage backups
  useEffect(() => {
    localStorage.setItem('orcamento_app_hospitais', JSON.stringify(hospitais));
  }, [hospitais]);

  useEffect(() => {
    localStorage.setItem('orcamento_app_procedimentos', JSON.stringify(procedimentos));
  }, [procedimentos]);

  useEffect(() => {
    localStorage.setItem('orcamento_app_pacientes', JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem('orcamento_app_historico', JSON.stringify(orcamentosSalvos));
  }, [orcamentosSalvos]);

  // Login & Logout
  const login = (username, password) => {
    if (username.trim().toLowerCase() === 'brunaizadora' && password === 'bruna12345') {
      const userData = { username: 'brunaizadora', nome: 'Bruna Izadora', role: 'Administradora' };
      setUser(userData);
      localStorage.setItem('orcamento_app_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Usuário ou senha incorretos!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('orcamento_app_user');
  };

  // CRUD Hospitais
  const addHospital = async (hosp) => {
    const newHosp = { ...hosp, id: `hosp-${Date.now()}` };
    setHospitais(prev => [...prev, newHosp]);
    try {
      await fetch('/api/hospitais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHosp)
      });
    } catch (e) {}
    return newHosp;
  };

  const updateHospital = async (id, updated) => {
    setHospitais(prev => prev.map(h => h.id === id ? { ...h, ...updated } : h));
    try {
      await fetch(`/api/hospitais/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {}
  };

  const deleteHospital = async (id) => {
    setHospitais(prev => prev.filter(h => h.id !== id));
    try {
      await fetch(`/api/hospitais/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // CRUD Procedimentos
  const addProcedimento = async (proc) => {
    const newProc = { ...proc, id: `proc-${Date.now()}` };
    setProcedimentos(prev => [...prev, newProc]);
    try {
      await fetch('/api/procedimentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProc)
      });
    } catch (e) {}
    return newProc;
  };

  const updateProcedimento = async (id, updated) => {
    setProcedimentos(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    try {
      await fetch(`/api/procedimentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {}
  };

  const deleteProcedimento = async (id) => {
    setProcedimentos(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/procedimentos/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // CRUD Pacientes
  const addPaciente = async (pac) => {
    const newPac = { ...pac, id: `pac-${Date.now()}` };
    setPacientes(prev => [...prev, newPac]);
    try {
      await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPac)
      });
    } catch (e) {}
    return newPac;
  };

  const updatePaciente = async (id, updated) => {
    setPacientes(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    try {
      await fetch(`/api/pacientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {}
  };

  const deletePaciente = async (id) => {
    setPacientes(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/pacientes/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // Seleções para o Orçamento
  const selectPacienteForBudget = (pacienteId) => {
    if (!pacienteId) {
      setCurrentOrcamento(prev => ({ ...prev, pacienteId: '', pacienteNome: '' }));
      return;
    }
    const pac = pacientes.find(p => p.id === pacienteId);
    if (pac) {
      setCurrentOrcamento(prev => ({
        ...prev,
        pacienteId: pac.id,
        pacienteNome: pac.nome
      }));
    }
  };

  const selectHospitalForBudget = (hospitalId) => {
    if (!hospitalId) {
      setCurrentOrcamento(prev => ({
        ...prev,
        hospitalId: '',
        hospitalNome: '',
        diariaHospitalar: 0,
        observacaoInternacao: ''
      }));
      return;
    }
    const hosp = hospitais.find(h => h.id === hospitalId);
    if (hosp) {
      setCurrentOrcamento(prev => ({
        ...prev,
        hospitalId: hosp.id,
        hospitalNome: hosp.nome,
        diariaHospitalar: hosp.diariaHospitalar,
        observacaoInternacao: hosp.observacaoInternacao
      }));
    }
  };

  const selectProcedimentoForBudget = (procedimentoId) => {
    if (!procedimentoId) {
      setCurrentOrcamento(prev => ({
        ...prev,
        procedimentoId: '',
        procedimentoNome: '',
        descricaoEquipe: '',
        valorEquipeVista: 0,
        valorEquipeCartao: 0,
        anestesiaHonorarios: 0,
        kitPosOperatorioValor: 0,
        kitPosOperatorioItens: '',
        seguroCirurgia: 0,
        gastosExtrasTexto: ''
      }));
      return;
    }
    const proc = procedimentos.find(p => p.id === procedimentoId);
    if (proc) {
      setCurrentOrcamento(prev => ({
        ...prev,
        procedimentoId: proc.id,
        procedimentoNome: proc.nome,
        descricaoEquipe: proc.descricaoEquipe,
        valorEquipeVista: proc.valorEquipeVista,
        valorEquipeCartao: proc.valorEquipeCartao,
        anestesiaHonorarios: proc.anestesiaHonorarios,
        kitPosOperatorioValor: proc.kitPosOperatorioValor,
        kitPosOperatorioItens: Array.isArray(proc.kitPosOperatorioItens) 
          ? proc.kitPosOperatorioItens.join('\n') 
          : proc.kitPosOperatorioItens,
        seguroCirurgia: proc.seguroCirurgia,
        gastosExtrasTexto: Array.isArray(proc.gastosExtras)
          ? proc.gastosExtras.join('\n')
          : proc.gastosExtras
      }));
    }
  };

  // Salvar Orçamento no Histórico e Backend API
  const saveOrcamento = async () => {
    const novoOrcamentoSalvo = {
      ...currentOrcamento,
      id: currentOrcamento.id || `orc-${Date.now()}`,
      dataCriacao: currentOrcamento.dataCriacao || new Date().toISOString()
    };

    setOrcamentosSalvos(prev => {
      const idx = prev.findIndex(o => o.id === novoOrcamentoSalvo.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = novoOrcamentoSalvo;
        return copy;
      }
      return [novoOrcamentoSalvo, ...prev];
    });

    setCurrentOrcamento(novoOrcamentoSalvo);

    try {
      await fetch('/api/orcamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoOrcamentoSalvo)
      });
    } catch (e) {}

    return novoOrcamentoSalvo;
  };

  const deleteOrcamentoSalvo = async (id) => {
    setOrcamentosSalvos(prev => prev.filter(o => o.id !== id));
    try {
      await fetch(`/api/orcamentos/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      hospitais,
      addHospital,
      updateHospital,
      deleteHospital,
      procedimentos,
      addProcedimento,
      updateProcedimento,
      deleteProcedimento,
      pacientes,
      addPaciente,
      updatePaciente,
      deletePaciente,
      currentOrcamento,
      setCurrentOrcamento,
      resetCurrentOrcamento,
      selectPacienteForBudget,
      selectHospitalForBudget,
      selectProcedimentoForBudget,
      orcamentosSalvos,
      saveOrcamento,
      deleteOrcamentoSalvo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
