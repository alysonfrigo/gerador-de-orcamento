import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { BudgetForm } from './components/BudgetForm';
import { BudgetDocumentPreview } from './components/BudgetDocumentPreview';
import { CadastrosManager } from './components/CadastrosManager';
import { HistoricoManager } from './components/HistoricoManager';
import { exportToPDF } from './utils/pdfExport';
import { Save, Printer, Download, Sparkles, AlertCircle } from 'lucide-react';

export const App = () => {
  const { user, currentOrcamento, saveOrcamento } = useApp();
  const [activeTab, setActiveTab] = useState('gerador');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!user) {
    return <Login />;
  }

  const validateOrcamento = () => {
    setValidationError('');
    if (!currentOrcamento.hospitalId) {
      const msg = 'Selecione um Hospital antes de continuar.';
      setValidationError(msg);
      alert('⚠️ ' + msg);
      return false;
    }
    if (!currentOrcamento.pacienteId && !currentOrcamento.pacienteNome?.trim()) {
      const msg = 'Selecione ou informe um Paciente antes de continuar.';
      setValidationError(msg);
      alert('⚠️ ' + msg);
      return false;
    }
    if (!currentOrcamento.procedimentoId) {
      const msg = 'Selecione um Procedimento antes de continuar.';
      setValidationError(msg);
      alert('⚠️ ' + msg);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateOrcamento()) return;
    await saveOrcamento();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleExportPDF = async () => {
    if (!validateOrcamento()) return;
    await saveOrcamento();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);

    const pacienteStr = (currentOrcamento.pacienteNome || 'Orçamento').replace(/[^a-zA-Z0-9]/g, '_');
    const procStr = (currentOrcamento.procedimentoNome || 'Procedimento').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Orcamento_${procStr}_${pacienteStr}.pdf`;
    exportToPDF('document-preview-printable', fileName);
  };

  const handlePrint = async () => {
    if (!validateOrcamento()) return;
    await saveOrcamento();
    window.print();
  };

  return (
    <div className="app-root">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-container">
        {activeTab === 'gerador' && (
          <div className="workspace-grid">
            {/* PAINEL ESQUERDO: EDITAR CAMPOS */}
            <div className="editor-card">
              <div className="card-header-bar">
                <h3>
                  <Sparkles size={18} className="text-primary" />
                  <span>Edição do Orçamento</span>
                </h3>

                <div className="action-buttons">
                  <button className="btn-action btn-success" onClick={handleSave}>
                    <Save size={16} />
                    <span>{savedFeedback ? 'Salvo!' : 'Salvar'}</span>
                  </button>
                </div>
              </div>

              {validationError && (
                <div className="error-banner" style={{ margin: '16px 24px 0' }}>
                  <AlertCircle size={18} />
                  <span>{validationError}</span>
                </div>
              )}

              <BudgetForm />
            </div>

            {/* PAINEL DIREITO: PRÉ-VISUALIZAÇÃO / PDF */}
            <div className="preview-card">
              <div className="card-header-bar">
                <h3>Pré-Visualização do Documento</h3>

                <div className="action-buttons">
                  <button className="btn-action" onClick={handlePrint} title="Imprimir e salvar orçamento">
                    <Printer size={16} />
                    <span>Imprimir</span>
                  </button>

                  <button className="btn-action btn-pdf" onClick={handleExportPDF} title="Salvar e Baixar PDF">
                    <Download size={16} />
                    <span>Exportar PDF</span>
                  </button>
                </div>
              </div>

              <BudgetDocumentPreview />
            </div>
          </div>
        )}

        {activeTab === 'cadastros' && <CadastrosManager />}

        {activeTab === 'historico' && <HistoricoManager setActiveTab={setActiveTab} />}
      </main>
    </div>
  );
};

export default App;
