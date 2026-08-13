import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// ROTAS DE API: HOSPITAIS
// ==========================================
app.get('/api/hospitais', (req, res) => {
  try {
    const hospitais = db.prepare('SELECT * FROM hospitais').all();
    res.json(hospitais);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/hospitais', (req, res) => {
  try {
    const { id, nome, cidade, diariaHospitalar, estimativaHoras, valorHoraExcedente, observacaoInternacao } = req.body;
    const newId = id || `hosp-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO hospitais (id, nome, cidade, diariaHospitalar, estimativaHoras, valorHoraExcedente, observacaoInternacao)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(newId, nome, cidade || '', diariaHospitalar || 0, estimativaHoras || 5, valorHoraExcedente || 0, observacaoInternacao || '');
    const created = db.prepare('SELECT * FROM hospitais WHERE id = ?').get(newId);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/hospitais/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cidade, diariaHospitalar, estimativaHoras, valorHoraExcedente, observacaoInternacao } = req.body;
    const stmt = db.prepare(`
      UPDATE hospitais 
      SET nome = ?, cidade = ?, diariaHospitalar = ?, estimativaHoras = ?, valorHoraExcedente = ?, observacaoInternacao = ?
      WHERE id = ?
    `);
    stmt.run(nome, cidade, diariaHospitalar, estimativaHoras, valorHoraExcedente, observacaoInternacao, id);
    const updated = db.prepare('SELECT * FROM hospitais WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/hospitais/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM hospitais WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ROTAS DE API: PROCEDIMENTOS
// ==========================================
app.get('/api/procedimentos', (req, res) => {
  try {
    const procs = db.prepare('SELECT * FROM procedimentos').all();
    const formatted = procs.map(p => ({
      ...p,
      kitPosOperatorioItens: p.kitPosOperatorioItens ? JSON.parse(p.kitPosOperatorioItens) : [],
      gastosExtras: p.gastosExtras ? JSON.parse(p.gastosExtras) : []
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/procedimentos', (req, res) => {
  try {
    const { id, nome, descricaoEquipe, valorEquipeVista, valorEquipeCartao, anestesiaHonorarios, kitPosOperatorioValor, kitPosOperatorioItens, seguroCirurgia, gastosExtras } = req.body;
    const newId = id || `proc-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO procedimentos (id, nome, descricaoEquipe, valorEquipeVista, valorEquipeCartao, anestesiaHonorarios, kitPosOperatorioValor, kitPosOperatorioItens, seguroCirurgia, gastosExtras)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      newId, nome, descricaoEquipe || '', valorEquipeVista || 0, valorEquipeCartao || 0,
      anestesiaHonorarios || 0, kitPosOperatorioValor || 0,
      JSON.stringify(kitPosOperatorioItens || []), seguroCirurgia || 0, JSON.stringify(gastosExtras || [])
    );
    res.status(201).json({ id: newId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/procedimentos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricaoEquipe, valorEquipeVista, valorEquipeCartao, anestesiaHonorarios, kitPosOperatorioValor, kitPosOperatorioItens, seguroCirurgia, gastosExtras } = req.body;
    const stmt = db.prepare(`
      UPDATE procedimentos 
      SET nome = ?, descricaoEquipe = ?, valorEquipeVista = ?, valorEquipeCartao = ?, anestesiaHonorarios = ?, kitPosOperatorioValor = ?, kitPosOperatorioItens = ?, seguroCirurgia = ?, gastosExtras = ?
      WHERE id = ?
    `);
    stmt.run(
      nome, descricaoEquipe, valorEquipeVista, valorEquipeCartao, anestesiaHonorarios, kitPosOperatorioValor,
      JSON.stringify(kitPosOperatorioItens || []), seguroCirurgia, JSON.stringify(gastosExtras || []), id
    );
    res.json({ id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/procedimentos/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM procedimentos WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ROTAS DE API: PACIENTES
// ==========================================
app.get('/api/pacientes', (req, res) => {
  try {
    const pacientes = db.prepare('SELECT * FROM pacientes').all();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pacientes', (req, res) => {
  try {
    const { id, nome, cpf, telefone, cidade } = req.body;
    const newId = id || `pac-${Date.now()}`;
    const stmt = db.prepare('INSERT INTO pacientes (id, nome, cpf, telefone, cidade) VALUES (?, ?, ?, ?, ?)');
    stmt.run(newId, nome, cpf || '', telefone || '', cidade || '');
    res.status(201).json({ id: newId, nome, cpf, telefone, cidade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/pacientes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, telefone, cidade } = req.body;
    const stmt = db.prepare('UPDATE pacientes SET nome = ?, cpf = ?, telefone = ?, cidade = ? WHERE id = ?');
    stmt.run(nome, cpf, telefone, cidade, id);
    res.json({ id, nome, cpf, telefone, cidade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/pacientes/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM pacientes WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ROTAS DE API: ORÇAMENTOS (HISTÓRICO)
// ==========================================
app.get('/api/orcamentos', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM orcamentos ORDER BY dataCriacao DESC').all();
    const formatted = list.map(o => ({
      ...o,
      formasPagamento: o.formasPagamento ? JSON.parse(o.formasPagamento) : {}
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orcamentos', (req, res) => {
  try {
    const o = req.body;
    const newId = o.id || `orc-${Date.now()}`;
    const dataCriacao = o.dataCriacao || new Date().toISOString();

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO orcamentos (
        id, procedimentoId, procedimentoNome, pacienteId, pacienteNome, hospitalId, hospitalNome,
        cidadeData, diariaHospitalar, observacaoInternacao, anestesiaHonorarios, observacaoAnestesia,
        descricaoEquipe, valorEquipeVista, valorEquipeCartao, parcelamentoTexto, kitPosOperatorioValor,
        kitPosOperatorioItens, seguroCirurgia, observacoesTotais, gastosExtrasTexto, validadeDias,
        formasPagamento, dataCriacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      newId, o.procedimentoId || '', o.procedimentoNome || '', o.pacienteId || '', o.pacienteNome || '',
      o.hospitalId || '', o.hospitalNome || '', o.cidadeData || '', o.diariaHospitalar || 0,
      o.observacaoInternacao || '', o.anestesiaHonorarios || 0, o.observacaoAnestesia || '',
      o.descricaoEquipe || '', o.valorEquipeVista || 0, o.valorEquipeCartao || 0, o.parcelamentoTexto || '',
      o.kitPosOperatorioValor || 0, o.kitPosOperatorioItens || '', o.seguroCirurgia || 0,
      o.observacoesTotais || '', o.gastosExtrasTexto || '', o.validadeDias || 30,
      JSON.stringify(o.formasPagamento || {}), dataCriacao
    );

    res.status(201).json({ ...o, id: newId, dataCriacao });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orcamentos/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM orcamentos WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servir arquivos estáticos do frontend React no Render
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
