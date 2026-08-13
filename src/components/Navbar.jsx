import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Stethoscope, FileText, Database, History, LogOut, DownloadCloud } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação do PWA');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand">
          <div className="brand-logo">
            <Stethoscope size={22} />
          </div>
          <div className="brand-title">
            <h2>Gerador de Orçamento</h2>
            <span>Procedimentos Cirúrgicos</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'gerador' ? 'active' : ''}`}
            onClick={() => setActiveTab('gerador')}
          >
            <FileText size={16} />
            <span>Criar Orçamento</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'cadastros' ? 'active' : ''}`}
            onClick={() => setActiveTab('cadastros')}
          >
            <Database size={16} />
            <span>Cadastros</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'historico' ? 'active' : ''}`}
            onClick={() => setActiveTab('historico')}
          >
            <History size={16} />
            <span>Histórico</span>
          </button>
        </nav>

        <div className="user-profile">
          {deferredPrompt && (
            <button className="btn-action btn-pdf" onClick={handleInstallPWA} title="Instalar aplicativo no dispositivo">
              <DownloadCloud size={16} />
              <span>Instalar App</span>
            </button>
          )}

          <div className="user-badge">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'B'}
            </div>
            <span className="user-info">{user?.nome || 'Bruna Izadora'}</span>
          </div>

          <button className="btn-logout" onClick={logout} title="Sair da conta">
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
