import { Language } from '../types';

export interface HelpItem {
  title: string;
  content: string;
}

export interface FeedbackTypeOption {
  id: string;
  label: string;
}

export interface PolicyCommitment {
  title: string;
  desc: string;
}

export interface PrivacyData {
  title: string;
  subtitle: string;
  cardTitle: string;
  cardBadge: string;
  statusTitle: string;
  statusDesc: string;
  commitmentsTitle: string;
  commitments: PolicyCommitment[];
  contactNote: string;
}

export interface TermsData {
  title: string;
  subtitle: string;
  cardTitle: string;
  cardBadge: string;
  statusTitle: string;
  statusDesc: string;
  guidelinesTitle: string;
  guidelines: PolicyCommitment[];
  contactNote: string;
}

export function getHelpFaq(_lang?: Language): HelpItem[] {
  return [
    {
      title: 'Como funciona a criação do meu site?',
      content:
        'Você pode navegar pela Vitrine de Demonstrações no Portfólio, escolher um modelo de referência ou solicitar um projeto sob medida. Em seguida, preencha o assistente de Briefing com os detalhes da sua empresa. Nossa equipe analisa as informações e entra em contato para alinhar prazos e iniciar o desenvolvimento.',
    },
    {
      title: 'Qual plano escolher para o meu negócio?',
      content:
        '• Plano Essencial (a partir de R$ 1.000): Ideal para Landing Pages de alta conversão, voltadas para captação direta de clientes e negócios locais.\n• Plano Profissional (a partir de R$ 1.700): Site institucional completo com catálogo, seções estruturadas, agendamento e SEO para presença forte.\n• Plano Personalizado / Premium: Estrutura personalizada com integrações sob medida e recursos exclusivos.',
    },
    {
      title: 'Como preencher o Briefing?',
      content:
        'O Briefing é organizado em etapas intuitivas: segmento da empresa, objetivos comerciais, funcionalidades necessárias e preferências de identidade visual. Você não precisa responder tudo de uma vez: seu rascunho é salvo automaticamente no aplicativo para você retomar quando quiser.',
    },
    {
      title: 'O que acontece após o envio do Briefing?',
      content:
        'Nossa equipe técnica valida os requisitos, calcula a estimativa de prazo e entra em contato via WhatsApp ou e-mail com a proposta comercial oficial. Nenhuma cobrança é realizada antes da sua aprovação formal.',
    },
    {
      title: 'Como acompanhar o andamento do meu site?',
      content:
        'Na aba Área do Cliente, você pode inserir a chave de acesso exclusiva do seu projeto para acompanhar as etapas em tempo real: briefing, design, desenvolvimento, homologação e publicação.',
    },
  ];
}

export function getFeedbackTypes(_lang?: Language): FeedbackTypeOption[] {
  return [
    { id: 'Sugestão', label: 'Sugestão' },
    { id: 'Relatar problema', label: 'Relatar problema' },
    { id: 'Elogio', label: 'Elogio' },
    { id: 'Outro', label: 'Outro' },
  ];
}

export function getPrivacyData(_lang?: Language): PrivacyData {
  return {
    title: 'Privacidade',
    subtitle: 'Compromisso com a segurança e privacidade das suas informações',
    cardTitle: 'Política de Privacidade & Dados',
    cardBadge: 'Diretrizes da NexaWeb',
    statusTitle: 'Status da Política Formal:',
    statusDesc:
      'O documento formal completo da Política de Privacidade está em processo de estruturação jurídica para publicação oficial no site nexaweeb.vercel.app.',
    commitmentsTitle: 'Compromissos vigentes da NexaWeb:',
    commitments: [
      {
        title: 'Finalidade comercial exclusiva:',
        desc: 'As informações fornecidas no briefing (nome, telefone, empresa, preferências) são utilizadas apenas para alinhamento de propostas e atendimento ao seu projeto.',
      },
      {
        title: 'Não compartilhamento:',
        desc: 'Não vendemos, não alugamos e não compartilhamos seus dados com terceiros ou anunciantes.',
      },
      {
        title: 'Armazenamento seguro do rascunho:',
        desc: 'O rascunho do formulário de briefing fica armazenado unicamente no armazenamento local do seu próprio aparelho, não sendo transmitido sem sua ação de envio.',
      },
    ],
    contactNote:
      'Para esclarecer qualquer dúvida sobre privacidade e tratamento de dados, escreva para nexaweeb@gmail.com.',
  };
}

export function getTermsData(_lang?: Language): TermsData {
  return {
    title: 'Termos de Uso',
    subtitle: 'Condições gerais de serviço e contratação de projetos',
    cardTitle: 'Termos & Condições de Serviço',
    cardBadge: 'Contratação de sites profissionais',
    statusTitle: 'Status dos Termos Formais:',
    statusDesc:
      'Os termos gerais formais de contratação estão em fase de consolidação contratual definitiva e podem ser consultados diretamente com nossos especialistas durante a validação da sua proposta.',
    guidelinesTitle: 'Diretrizes gerais aplicáveis:',
    guidelines: [
      {
        title: 'Transparência comercial:',
        desc: 'Todos os planos (Essencial, Profissional e Personalizado), valores base e recursos adicionais são informados com clareza nas abas de Serviços e Briefing.',
      },
      {
        title: 'Validação prévia:',
        desc: 'Todo projeto depende da aprovação mútua da proposta comercial e do cronograma antes de qualquer cobrança ou entrega definitiva.',
      },
      {
        title: 'Demonstrações conceituais:',
        desc: 'Os projetos interativos exibidos no portfólio são modelos de demonstração para apresentar a qualidade e as capacidades técnicas da agência.',
      },
    ],
    contactNote:
      'Dúvidas comerciais ou solicitações de contrato formal podem ser enviadas para nexaweeb@gmail.com.',
  };
}
