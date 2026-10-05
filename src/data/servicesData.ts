import { ServicePlan, Language } from '../types';

export const getNexawebPlans = (lang: Language = 'pt'): ServicePlan[] => {
  if (lang === 'en') {
    return [
      {
        id: 'essencial',
        nome: 'ESSENCIAL',
        tagline: 'Professional website to get started',
        corIdentidade: 'azul',
        descricao: 'Ideal for independent professionals and small businesses needing an impactful, fast, and professional digital presence.',
        recursos: [
          'Professional single-page landing page',
          'Responsive design for mobile, tablet, and desktop',
          'Direct WhatsApp contact buttons',
          'Optimized fast loading speed',
          'Services & products showcase section',
          'Secure hosting & SSL certificate included'
        ]
      },
      {
        id: 'profissional',
        nome: 'PROFISSIONAL',
        tagline: 'More features for your business',
        corIdentidade: 'dourado',
        destaque: true,
        descricao: 'The top choice for established companies looking to attract new clients, build brand authority, and highlight their key differentiators.',
        recursos: [
          'Multi-page structure or in-depth sections',
          'Interactive catalog of services or products',
          'Smart client inquiry form',
          'Complete Google SEO optimization',
          'Google Maps and review integration',
          'Custom premium layout with tailored typography and palette',
          'Floating personalized customer service button'
        ]
      },
      {
        id: 'personalizado',
        nome: 'PERSONALIZADO',
        tagline: 'A custom project crafted for you',
        corIdentidade: 'roxo',
        descricao: 'Tailor-made development featuring exclusive architecture, custom functionalities, and direct strategic support from NexaWeb.',
        recursos: [
          '100% custom project built for your unique business',
          'Specific systems (online booking, custom menu, dynamic portfolio)',
          'Strategic persuasive copywriting aligned with your audience',
          'Integration with management tools and CRM',
          'Advanced performance and metrics optimization',
          'Priority dedicated support and guidance'
        ]
      }
    ];
  }

  return [
    {
      id: 'essencial',
      nome: 'ESSENCIAL',
      tagline: 'Site profissional para começar',
      corIdentidade: 'azul',
      descricao: 'Ideal para profissionais autônomos e pequenos negócios que precisam de presença digital profissional com agilidade e alto impacto.',
      recursos: [
        'Landing page profissional de página única',
        'Design responsivo para celular, tablet e computador',
        'Botões de contato direto para o WhatsApp',
        'Carregamento rápido otimizado',
        'Seção de apresentação de serviços e produtos',
        'Hospedagem segura e certificado SSL incluídos'
      ]
    },
    {
      id: 'profissional',
      nome: 'PROFISSIONAL',
      tagline: 'Mais recursos para o seu negócio',
      corIdentidade: 'dourado',
      destaque: true,
      descricao: 'A melhor escolha para empresas consolidadas que desejam atrair novos clientes, fortalecer a autoridade da marca e destacar seus diferenciais.',
      recursos: [
        'Estrutura multipágina ou seções aprofundadas',
        'Catálogo interativo de serviços ou produtos',
        'Formulário inteligente de captação de clientes',
        'Otimização completa de SEO para o Google',
        'Integração com Google Maps e avaliações',
        'Layout premium com tipografia e paleta sob medida',
        'Botão flutuante de atendimento personalizado'
      ]
    },
    {
      id: 'personalizado',
      nome: 'PERSONALIZADO',
      tagline: 'Um projeto feito para você',
      corIdentidade: 'roxo',
      descricao: 'Desenvolvimento sob medida com arquitetura exclusiva, funcionalidades específicas e acompanhamento estratégico da NexaWeb.',
      recursos: [
        'Projeto 100% exclusivo criado para o seu negócio',
        'Sistemas específicos (agendamentos, cardápio próprio, portfólio dinâmico)',
        'Copywriting persuasivo e estratégico alinhado ao seu público',
        'Integração com ferramentas de gestão e CRM',
        'Otimização avançada de performance e métricas',
        'Acompanhamento e suporte prioritário direto'
      ]
    }
  ];
};

export const NEXAWEB_PLANS = getNexawebPlans('pt');
