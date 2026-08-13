import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(username, password);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="avatar-badge-login">
            <img src="/bruna.png" alt="Bruna Izadora" />
          </div>
          <h1>Gerador de Orçamento</h1>
          <p>Plataforma de Orçamentos Cirúrgicos</p>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuário</label>
            <div className="input-with-icon">
              <User />
              <input
                type="text"
                className="input-control"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>Senha</label>
            <div className="input-with-icon">
              <Lock />
              <input
                type="password"
                className="input-control"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '24px' }}>
            <span>Acessar o Sistema</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
