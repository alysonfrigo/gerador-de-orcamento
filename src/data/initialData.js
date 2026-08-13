export const initialHospitais = [
  {
    id: 'hosp-1',
    nome: 'Hospital Dr. Lima',
    cidade: 'Cascavel/PR',
    diariaHospitalar: 5800.00,
    estimativaHoras: 5,
    valorHoraExcedente: 1000.00,
    observacaoInternacao: 'Possíveis alterações no tempo cirúrgico e/ou no período de internação podem gerar ajustes nos valores cobrados pelo hospital e pela equipe de anestesiologia.'
  },
  {
    id: 'hosp-2',
    nome: 'Hospital Gênesis – Cascavel/PR',
    cidade: 'Cascavel/PR',
    diariaHospitalar: 6400.00,
    estimativaHoras: 5,
    valorHoraExcedente: 1200.00,
    observacaoInternacao: 'O valor informado referente ao internamento hospitalar considera uma estimativa de até 5 horas de cirurgia. Como não é possível prever ou garantir previamente o tempo exato do procedimento, caso a cirurgia ultrapasse o período estimado, poderá haver cobrança adicional de R$ 1.200,00 por hora excedente, conforme política do hospital.'
  },
  {
    id: 'hosp-3',
    nome: 'Hospital São Lucas – Cascavel/PR',
    cidade: 'Cascavel/PR',
    diariaHospitalar: 6000.00,
    estimativaHoras: 5,
    valorHoraExcedente: 1100.00,
    observacaoInternacao: 'Possíveis alterações no tempo cirúrgico e/ou no período de internação podem gerar ajustes nos valores cobrados pelo hospital e pela equipe de anestesiologia conforme normas da instituição.'
  }
];

export const initialProcedimentos = [
  {
    id: 'proc-1',
    nome: 'Lipoabdominoplastia',
    descricaoEquipe: '(Inclui cirurgião plástico principal, cirurgião auxiliar e instrumentador cirúrgico)',
    valorEquipeVista: 19000.00,
    valorEquipeCartao: 21000.00,
    anestesiaHonorarios: 4500.00,
    kitPosOperatorioValor: 1500.00,
    kitPosOperatorioItens: [
      'Dois macacões cirúrgicos pós-operatórios',
      'Um kit de placas',
      'Um par de meias antitrombo'
    ],
    seguroCirurgia: 860.00,
    gastosExtras: [
      'Drenagem linfática: não inclusa (Indicamos profissionais especializados, caso necessário)',
      'Exame anatomopatológico do tecido mamário, quando houver indicação ou necessidade de envio de material para análise laboratorial. O valor deste exame não está incluído no presente orçamento e poderá ser cobrado separadamente.'
    ]
  },
  {
    id: 'proc-2',
    nome: 'Mastopexia com Prótese',
    descricaoEquipe: '(Inclui cirurgião plástico principal, cirurgião auxiliar e instrumentador cirúrgico)',
    valorEquipeVista: 17500.00,
    valorEquipeCartao: 19500.00,
    anestesiaHonorarios: 4200.00,
    kitPosOperatorioValor: 1200.00,
    kitPosOperatorioItens: [
      'Sutiã pós-cirúrgico com faixa',
      'Um par de meias antitrombo'
    ],
    seguroCirurgia: 600.00,
    gastosExtras: [
      'Drenagem linfática: não inclusa',
      'Exame anatomopatológico se houver retração de tecido'
    ]
  }
];

export const initialPacientes = [
  {
    id: 'pac-1',
    nome: 'Paulina Lemes Pessoa Da Silva',
    cpf: '123.456.789-00',
    telefone: '(45) 99999-1111',
    cidade: 'Cascavel/PR'
  },
  {
    id: 'pac-2',
    nome: 'Iredani de Jesus Silva',
    cpf: '987.654.321-11',
    telefone: '(45) 98888-2222',
    cidade: 'Cascavel/PR'
  }
];

export const initialFormasPagamentoDefinidas = {
  internacao: 'Pagamento realizado diretamente com o setor financeiro do hospital, conforme regras e condições da instituição.',
  anestesia: 'Pagamento realizado diretamente à equipe de anestesia, no dia da consulta pré anestésica ou até um dia antes da cirurgia.',
  equipe: 'O pagamento é realizado diretamente ao cirurgião responsável, que fará a divisão interna com a equipe.\nPara reserva da data cirúrgica, é necessário o pagamento de 30% do valor da equipe cirúrgica. O saldo restante deverá ser quitado em até 15 dias antes do procedimento.'
};
