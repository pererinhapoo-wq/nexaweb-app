import { PortfolioCategory, PortfolioProject } from '../types';

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  { id: 'todos', nome: 'Todos' },
  { id: 'landing-pages', nome: 'Landing Pages' },
  { id: 'institucional', nome: 'Institucionais' },
  { id: 'delivery-gastronomia', nome: 'Gastronomia & Delivery' },
  { id: 'saude-estetica', nome: 'Saúde & Estética' },
  { id: 'servicos-locais', nome: 'Serviços Locais' },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'demo-lp-conversao',
    titulo: 'Landing Page de Alta Conversão',
    categoria: 'landing-pages',
    descricaoCurta: 'Página focada em captação de leads com carregamento ultrarrápido e CTA persuasivo para WhatsApp.',
    descricaoCompleta: 'Estrutura otimizada para tráfego pago (Meta Ads e Google Ads). Copywriting persuasivo focado em converter visitantes em mensagens diretas no WhatsApp comercial.',
    segmentoAlvo: 'Empresas de serviços, infoprodutos, consultorias e lançamentos locais',
    tags: ['Alta Conversão', 'Mobile First', 'WhatsApp Integrado', 'SEO Local'],
    recursos: [
      'Carregamento instantâneo (< 1.2s)',
      'Botões flutuantes inteligentes de WhatsApp com mensagem pré-preenchida',
      'Formulário enxuto de qualificação',
      'Seções de Prova Social e Depoimentos em carrossel',
      'Pixel da Meta e Google Analytics pré-instalados'
    ],
    corDestaque: 'from-blue-600 to-indigo-600',
    linkDemo: 'https://nexaweb.demo/lp-alta-conversao'
  },
  {
    id: 'demo-clinica-estetica',
    titulo: 'Portal Clínica Estética & Harmonização',
    categoria: 'saude-estetica',
    descricaoCurta: 'Design sofisticado e elegante com agendamento direto de avaliação para procedimentos.',
    descricaoCompleta: 'Desenvolvido sob medida para clínicas médicas, estéticas e consultórios odontológicos. Transmite credibilidade, autoridade e sofisticação desde o primeiro segundo.',
    segmentoAlvo: 'Clínicas de estética, odontologia, dermatologia e médicos especialistas',
    tags: ['Design Premium', 'Galeria Antes & Depois', 'Agendamento Online', 'Elegante'],
    recursos: [
      'Layout limpo com paleta de luxo e tipografia refinada',
      'Galeria interativa de tratamentos e procedimentos',
      'Integração direta com a agenda da recepção',
      'FAQ de dúvidas frequentes que quebra objeções de compra',
      'Localização integrada com mapa Google interativo'
    ],
    corDestaque: 'from-rose-500 to-amber-600',
    linkDemo: 'https://nexaweb.demo/clinica-aurora'
  },
  {
    id: 'demo-delivery-gourmet',
    titulo: 'Cardápio Digital & Delivery Próprio',
    categoria: 'delivery-gastronomia',
    descricaoCurta: 'Cardápio interativo sem taxas abusivas de marketplaces, com pedido direto no WhatsApp.',
    descricaoCompleta: 'Solução perfeita para restaurantes, hamburguerias, pizzarias e confeitarias aumentarem suas margens de lucro sem depender exclusivamente de taxas do iFood.',
    segmentoAlvo: 'Hamburguerias, pizzarias, cafeterias, sushis e confeitarias',
    tags: ['Zero Taxa', 'Cardápio Interativo', 'Pedido no Zap', 'Fotos em Alta'],
    recursos: [
      'Catálogo interativo com fotos em alta definição e adicionais de pratos',
      'Cálculo automático de taxa de entrega por bairro/distância',
      'Exportação instantânea do pedido formatado no WhatsApp do estabelecimento',
      'Painel ágil para pausar itens esgotados em tempo real',
      'Interface fluida e sem necessidade de baixar aplicativo'
    ],
    corDestaque: 'from-amber-500 to-orange-600',
    linkDemo: 'https://nexaweb.demo/gourmet-express'
  },
  {
    id: 'demo-site-institucional',
    titulo: 'Site Institucional Corporativo Nexa',
    categoria: 'institucional',
    descricaoCurta: 'Presença digital autoritária para empresas de médio porte, indústrias e escritórios.',
    descricaoCompleta: 'Desenvolvido para consolidar a autoridade da marca no Google. Estrutura multipágina com apresentação da equipe, casos de sucesso e formulários com filtro de interesse.',
    segmentoAlvo: 'Advocacia, engenharia, contabilidade, empresas de logística e indústrias',
    tags: ['Autoridade', 'SEO Otimizado', 'Multi-página', 'Painel Fácil'],
    recursos: [
      'Estrutura com arquitetura de SEO avançada para ranquear no Google',
      'Área de apresentação corporativa, história e corpo de diretores',
      'Seção de artigos técnicos ou blog de conteúdo',
      'Certificado SSL e conformidade com LGPD',
      'Compatibilidade total com telas de celulares, tablets e desktops'
    ],
    corDestaque: 'from-emerald-500 to-teal-700',
    linkDemo: 'https://nexaweb.demo/institucional-prime'
  },
  {
    id: 'demo-servicos-reforma',
    titulo: 'Página de Prestador de Serviços & Orçamentos',
    categoria: 'servicos-locais',
    descricaoCurta: 'Focado em atrair orçamentos qualificados de clientes da mesma cidade e região.',
    descricaoCompleta: 'Ideal para profissionais autônomos e empresas locais que precisam de um canal direto e profissional para receber pedidos de cotação sem perder tempo.',
    segmentoAlvo: 'Ar-condicionado, energia solar, construtoras, marcenarias e eletricistas',
    tags: ['Captação Rápida', 'Calculadora de Cotação', 'Localização', 'WhatsApp Direct'],
    recursos: [
      'Simulador inicial de projeto/orçamento interativo',
      'Exibição de portfólio de obras concluídas com fotos e descrições',
      'Depoimentos em vídeo e print de clientes satisfeitos',
      'Chamada direta para ligação telefônica ou WhatsApp com um toque',
      'Badge de garantia de serviço e confiança'
    ],
    corDestaque: 'from-cyan-500 to-blue-600',
    linkDemo: 'https://nexaweb.demo/servicos-locais'
  }
];
