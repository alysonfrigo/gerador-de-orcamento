import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'orcamento.db');
const db = new Database(dbPath);

// Habilitar Foreign Keys e otimização
db.pragma('journal_mode = WAL');

// Inicialização de Tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS hospitais (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    cidade TEXT,
    diariaHospitalar REAL,
    estimativaHoras INTEGER,
    valorHoraExcedente REAL,
    observacaoInternacao TEXT
  );

  CREATE TABLE IF NOT EXISTS procedimentos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricaoEquipe TEXT,
    valorEquipeVista REAL,
    valorEquipeCartao REAL,
    anestesiaHonorarios REAL,
    kitPosOperatorioValor REAL,
    kitPosOperatorioItens TEXT,
    seguroCirurgia REAL,
    gastosExtras TEXT
  );

  CREATE TABLE IF NOT EXISTS pacientes (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    cpf TEXT,
    telefone TEXT,
    cidade TEXT
  );

  CREATE TABLE IF NOT EXISTS orcamentos (
    id TEXT PRIMARY KEY,
    procedimentoId TEXT,
    procedimentoNome TEXT,
    pacienteId TEXT,
    pacienteNome TEXT,
    hospitalId TEXT,
    hospitalNome TEXT,
    cidadeData TEXT,
    diariaHospitalar REAL,
    observacaoInternacao TEXT,
    anestesiaHonorarios REAL,
    observacaoAnestesia TEXT,
    descricaoEquipe TEXT,
    valorEquipeVista REAL,
    valorEquipeCartao REAL,
    parcelamentoTexto TEXT,
    kitPosOperatorioValor REAL,
    kitPosOperatorioItens TEXT,
    seguroCirurgia REAL,
    observacoesTotais TEXT,
    gastosExtrasTexto TEXT,
    validadeDias INTEGER,
    formasPagamento TEXT,
    dataCriacao TEXT
  );
`);

// Inserir dados iniciais se tabelas estiverem vazias
const countHospitais = db.prepare('SELECT COUNT(*) as count FROM hospitais').get();
if (countHospitais.count === 0) {
  const insertHosp = db.prepare(`
    INSERT INTO hospitais (id, nome, cidade, diariaHospitalar, estimativaHoras, valorHoraExcedente, observacaoInternacao)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertHosp.run(
    'hosp-1',
    'Hospital Dr. Lima',
    'Cascavel/PR',
    5800.00,
    5,
    1000.00,
    'Possíveis alterações no tempo cirúrgico e/ou no período de internação podem gerar ajustes nos valores cobrados pelo hospital e pela equipe de anestesiologia.'
  );

  insertHosp.run(
    'hosp-2',
    'Hospital Gênesis – Cascavel/PR',
    'Cascavel/PR',
    6400.00,
    5,
    1200.00,
    'O valor informado referente ao internamento hospitalar considera uma estimativa de até 5 horas de cirurgia. Como não é possível prever ou garantir previamente o tempo exato do procedimento, caso a cirurgia ultrapasse o período estimado, poderá haver cobrança adicional de R$ 1.200,00 por hora excedente, conforme política do hospital.'
  );
}

const countProc = db.prepare('SELECT COUNT(*) as count FROM procedimentos').get();
if (countProc.count === 0) {
  const insertProc = db.prepare(`
    INSERT INTO procedimentos (id, nome, descricaoEquipe, valorEquipeVista, valorEquipeCartao, anestesiaHonorarios, kitPosOperatorioValor, kitPosOperatorioItens, seguroCirurgia, gastosExtras)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProc.run(
    'proc-1',
    'Lipoabdominoplastia',
    '(Inclui cirurgião plástico principal, cirurgião auxiliar e instrumentador cirúrgico)',
    19000.00,
    21000.00,
    4500.00,
    1500.00,
    JSON.stringify(['Dois macacões cirúrgicos pós-operatórios', 'Um kit de placas', 'Um par de meias antitrombo']),
    860.00,
    JSON.stringify(['Drenagem linfática: não inclusa', 'Exame anatomopatológico se necessário'])
  );
}

const countPac = db.prepare('SELECT COUNT(*) as count FROM pacientes').get();
if (countPac.count === 0) {
  const insertPac = db.prepare(`
    INSERT INTO pacientes (id, nome, cpf, telefone, cidade)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertPac.run('pac-1', 'Paulina Lemes Pessoa Da Silva', '123.456.789-00', '(45) 99999-1111', 'Cascavel/PR');
  insertPac.run('pac-2', 'Iredani de Jesus Silva', '987.654.321-11', '(45) 98888-2222', 'Cascavel/PR');
}

export default db;
