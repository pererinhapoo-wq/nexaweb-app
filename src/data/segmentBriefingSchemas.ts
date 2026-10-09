import { Language } from '../types';

export interface SegmentOptionGroup {
  id: string;
  label: string;
  icon: string;
  category: string;
}

export interface SegmentBriefingConfig {
  segmentKey: string;
  name: string;
  icon: string;
  tagline: string;
  defaultServicesPlaceholder: string;
  primaryOptionsLabel: string;
  primaryOptions: string[];
  secondaryOptionsLabel: string;
  secondaryOptions: string[];
  featuresLabel: string;
  features: string[];
  schedulePlaceholder: string;
  teamPlaceholder: string;
  specialCalloutLabel?: string;
  specialCalloutDesc?: string;
}

export const CANONICAL_SEGMENTS: Record<string, SegmentBriefingConfig> = {
  academia: {
    segmentKey: 'academia',
    name: 'Academia & Fitness',
    icon: '🏋️',
    tagline: 'Centros de treino, crossfit, estúdios fitness e esportes',
    defaultServicesPlaceholder: 'Ex: Musculação, Treinamento Funcional, Crossfit, Aulas Coletivas, Avaliação Física...',
    primaryOptionsLabel: 'Modalidades Oferecidas',
    primaryOptions: [
      'Musculação Completa',
      'Treinamento Funcional',
      'Cross Training / Crossfit',
      'Pilates & Alongamento',
      'Lutas & Artes Marciais',
      'Dança & Ritmos',
      'Spinning / Indoor Bike',
      'Natação & Hidroginástica',
      'Avaliação Física / Bioimpedância',
      'Personal Trainer Dedicado',
    ],
    secondaryOptionsLabel: 'Planos & Mensalidades',
    secondaryOptions: [
      'Plano Mensal Livre',
      'Plano Trimestral',
      'Plano Semestral',
      'Plano Anual com Desconto',
      'Day Pass / Passe Diário',
      'Plano Família / Corporativo',
    ],
    featuresLabel: 'Diferenciais da Estrutura',
    features: [
      'Ambiente 100% Climatizado',
      'Estacionamento Gratuito',
      'Vestiários com Chuveiro Quente',
      'Área de Convivência & Suplementos',
      'Aplicativo Próprio de Treinos',
      'Aparelhos Biomecânicos Importados',
    ],
    schedulePlaceholder: 'Ex: Seg a Sex: 06h às 23h | Sáb: 08h às 16h | Dom: 09h às 13h',
    teamPlaceholder: 'Ex: Equipe de professores de Educação Física com registro no CREF e suporte na sala',
    specialCalloutLabel: 'Aula Experimental Gratuita',
    specialCalloutDesc: 'Destacar botão para visitante agendar uma primeira aula experimental grátis.',
  },

  restaurante: {
    segmentKey: 'restaurante',
    name: 'Restaurante & Gastronomia',
    icon: '🍽️',
    tagline: 'Restaurantes, bistrôs, pizzarias, hamburguerias e bares',
    defaultServicesPlaceholder: 'Ex: Almoço executivo, pratos à la carte, menu degustação, carta de vinhos...',
    primaryOptionsLabel: 'Tipo de Gastronomia',
    primaryOptions: [
      'Pizzaria Artesanal',
      'Hamburgueria Gourmet',
      'Japonesa & Sushi',
      'Italiana & Massas Frescas',
      'Carnes & Parrilla / Churrasco',
      'Café & Bistrô Contemporâneo',
      'Bar & Petiscos Especiais',
      'Buffet & Almoço por Quilo',
      'Frutos do Mar',
      'Culinária Saudável / Vegana',
    ],
    secondaryOptionsLabel: 'Serviços & Experiência',
    secondaryOptions: [
      'Reserva de Mesas Online',
      'Delivery Direto via WhatsApp',
      'Espaço para Eventos & Aniversários',
      'Música ao Vivo / Acústico',
      'Carta de Vinhos & Drinks Autorais',
      'Espaço Kids com Monitores',
    ],
    featuresLabel: 'Diferenciais do Restaurante',
    features: [
      'Ingredientes Frescos & Artesanais',
      'Estacionamento / Manobrista no local',
      'Ambiente Climatizado & Aconchegante',
      'Rolha Livre em Dias Selecionados',
      'Atendimento Rápido e Cordial',
    ],
    schedulePlaceholder: 'Ex: Ter a Sex: 18h às 23h | Sáb e Dom: 12h às 16h e 19h às 23h30',
    teamPlaceholder: 'Ex: Chef executivo especializado e equipe de salão dedicada',
    specialCalloutLabel: 'Cardápio Digital & Reservas',
    specialCalloutDesc: 'Apresentação com fotos apetitosas e canal direto para reservar mesas.',
  },

  clinica: {
    segmentKey: 'clinica',
    name: 'Clínica Médica & Saúde',
    icon: '🩺',
    tagline: 'Clínicas multidisciplinares, consultórios médicos, odontologia e saúde',
    defaultServicesPlaceholder: 'Ex: Consultas de rotina, exames clínicos, cirurgias ambulatoriais, tratamentos contínuos...',
    primaryOptionsLabel: 'Especialidades / Procedimentos',
    primaryOptions: [
      'Clínica Médica Geral',
      'Dermatologia Clínica & Estética',
      'Odontologia & Ortodontia',
      'Fisioterapia & Reabilitação',
      'Nutrição Clínica & Esportiva',
      'Psicologia & Psicoterapia',
      'Oftalmologia',
      'Pediatria & Puericultura',
      'Ortopedia & Traumatologia',
      'Exames Laboratoriais & Ultrassom',
    ],
    secondaryOptionsLabel: 'Forma de Atendimento',
    secondaryOptions: [
      'Atendimento Particular',
      'Principais Convênios Médicos',
      'Sistema de Reembolso Assistido',
      'Teleconsulta / Atendimento Online',
      'Plantão de Dúvidas via WhatsApp',
    ],
    featuresLabel: 'Diferenciais da Clínica',
    features: [
      'Acessibilidade Total para PCD',
      'Estacionamento Próprio com Valet',
      'Equipamentos de Última Geração',
      'Agendamento Ágil sem Filas',
      'Ambiente Humanizado e Seguro',
    ],
    schedulePlaceholder: 'Ex: Seg a Sex: 07h às 20h | Sáb: 08h às 13h',
    teamPlaceholder: 'Ex: Corpo clínico com médicos especialistas titulados e registro ativo no CRM/CRO',
    specialCalloutLabel: 'Triagem & Pré-Agendamento',
    specialCalloutDesc: 'Facilidade para o paciente solicitar agendamento com a secretária via WhatsApp.',
  },

  imobiliaria: {
    segmentKey: 'imobiliaria',
    name: 'Imobiliária & Construtora',
    icon: '🏢',
    tagline: 'Imobiliárias, corretores autônomos, construtoras e incorporadoras',
    defaultServicesPlaceholder: 'Ex: Apartamentos na planta, casas em condomínio fechado, imóveis de alto padrão, locação...',
    primaryOptionsLabel: 'Foco do Catálogo de Imóveis',
    primaryOptions: [
      'Imóveis de Alto Padrão / Luxo',
      'Apartamentos Residenciais',
      'Casas em Condomínio Fechado',
      'Lançamentos & Empreendimentos na Planta',
      'Terrenos & Lotes Urbanizados',
      'Salas Comerciais & Galpões',
      'Locação Residencial & Comercial',
      'Imóveis no Litoral / Campo',
    ],
    secondaryOptionsLabel: 'Recursos do Catálogo',
    secondaryOptions: [
      'Filtro Avançado (Tipo, Preço, Quartos)',
      'Fotos Profissionais em Alta Resolução',
      'Planta Baixa & Detalhes Técnicos',
      'Simulador de Financiamento Bancário',
      'Tour Virtual / Vídeo do Imóvel',
      'Botão Direto com Corretor Responsável',
    ],
    featuresLabel: 'Diferenciais da Imobiliária',
    features: [
      'Assessoria Jurídica Imobiliária Completa',
      'Avaliação Gratuita de Imóveis',
      'Parceria com Principais Bancos Financiadores',
      'Plantão de Vendas com Atendimento Imediato',
      'CRECI Ativo e Credibilidade Comprovada',
    ],
    schedulePlaceholder: 'Ex: Seg a Sex: 08h30 às 18h30 | Sáb: 09h às 14h (Plantão online 24h)',
    teamPlaceholder: 'Ex: Equipe de corretores credenciados especialistas em cada região da cidade',
    specialCalloutLabel: 'Simulação & Agendamento de Visitas',
    specialCalloutDesc: 'Gatilho para o cliente solicitar visita presencial com o corretor responsável.',
  },

  loja: {
    segmentKey: 'loja',
    name: 'Loja Conceito & E-commerce',
    icon: '🛍️',
    tagline: 'Lojas de moda, acessórios, calçados, cosméticos e comércio em geral',
    defaultServicesPlaceholder: 'Ex: Coleção feminina, calçados em couro, bolsas, acessórios banhados a ouro...',
    primaryOptionsLabel: 'Nicho da Loja',
    primaryOptions: [
      'Moda Feminina & Casual',
      'Moda Masculina & Alfaiataria',
      'Calçados, Bolsas & Couro',
      'Semijoias & Acessórios Finos',
      'Cosméticos & Perfumaria',
      'Decoração & Mesa Posta',
      'Eletrônicos & Smart Gadgets',
      'Artesanato & Presentes Afetivos',
      'Moda Praia & Fitness',
    ],
    secondaryOptionsLabel: 'Modelo de Vendas Desejado',
    secondaryOptions: [
      'Catálogo com Pedido Finalizado no WhatsApp',
      'Loja Virtual com Carrinho & Checkout Online',
      'Vitrine de Catálogo para Loja Física',
      'Atendimento Personalizado com Vendedora',
    ],
    featuresLabel: 'Formas de Envio & Benefícios',
    features: [
      'Envio para Todo o Brasil (Correios / Sedex)',
      'Entrega Expressa por Motoboy na Cidade',
      'Opção de Retirada Grátis na Loja Física',
      'Troca Fácil e Rápida Garantida',
      'Parcelamento Sem Juros no Cartão',
    ],
    schedulePlaceholder: 'Ex: Loja Online 24h | Atendimento WhatsApp: Seg a Sáb das 09h às 19h',
    teamPlaceholder: 'Ex: Consultoras de estilo e equipe de expedição dedicada',
    specialCalloutLabel: 'Vitrine Visual & Compras Ágeis',
    specialCalloutDesc: 'Design com foco em fotos nítidas dos produtos para acelerar a decisão de compra.',
  },

  barbearia: {
    segmentKey: 'barbearia',
    name: 'Barbearia & Masculino',
    icon: '💈',
    tagline: 'Barbearias clássicas, contemporâneas e centros de estética masculina',
    defaultServicesPlaceholder: 'Ex: Corte degradê, barba na toalha quente, pigmentação, hidratação capilar...',
    primaryOptionsLabel: 'Serviços Principais',
    primaryOptions: [
      'Corte Cabelo Clássico / Degradê',
      'Barba Completa com Toalha Quente',
      'Combo Cabelo + Barba',
      'Pigmentação de Cabelo / Barba',
      'Selagem / Alinhamento Capilar',
      'Limpeza de Pele & Esfoliação Facial',
      'Sobrancelha na Navalha',
      'Tratamento para Calvície / Queda',
      'Plano Mensal de Barba & Cabelo',
    ],
    secondaryOptionsLabel: 'Diferenciais da Barbearia',
    secondaryOptions: [
      'Cerveja Gelada & Bebidas Especiais',
      'Mesa de Sinuca / Lounge de Espera',
      'Ambiente Climatizado com Som Ambiente',
      'Agendamento de Horário sem Espera',
      'Produtos Profissionais para Cuidados em Casa',
    ],
    featuresLabel: 'Estrutura & Conforto',
    features: [
      'Cadeiras Hidráulicas Confortáveis',
      'Navalhas Esterilizadas e Descartáveis',
      'Wi-Fi Rápido para Clientes',
      'Estacionamento Facilitado na Região',
    ],
    schedulePlaceholder: 'Ex: Ter a Sex: 09h às 20h | Sáb: 08h às 19h',
    teamPlaceholder: 'Ex: Barbeiros experientes especialistas em cortes modernos e clássicos',
    specialCalloutLabel: 'Tabela de Valores & Agendamento',
    specialCalloutDesc: 'Exibição clara de cada serviço com tempo estimado e botão de WhatsApp.',
  },

  salao: {
    segmentKey: 'salao',
    name: 'Salão de Beleza & Estética',
    icon: '💅',
    tagline: 'Salões de beleza, estúdios de cabelo, maquiagem e procedimentos estéticos',
    defaultServicesPlaceholder: 'Ex: Mechas e loiros, cortes femininos, manicure em gel, maquiagem profissional...',
    primaryOptionsLabel: 'Procedimentos Oferecidos',
    primaryOptions: [
      'Cortes, Escovas & Tratamentos Capilares',
      'Mechas, Iluminados & Coloração',
      'Manicure, Pedicure & Unhas em Gel',
      'Maquiagem Profissional Social & Noivas',
      'Design de Sobrancelhas & Lash Lifting',
      'Limpeza de Pele & Rejuvenescimento',
      'Mega Hair & Extensão Capilar',
      'Dia da Noiva / Madrinhas / Debutantes',
    ],
    secondaryOptionsLabel: 'Diferenciais do Studio',
    secondaryOptions: [
      'Produtos de Linhas Profissionais Importadas',
      'Ambiente Requintado com Iluminação Perfeita',
      'Atendimento Exclusivo com Hora Marcada',
      'Pacotes Personalizados para Eventos',
      'Café, Chás e Recepção Diferenciada',
    ],
    featuresLabel: 'Estrutura & Segurança',
    features: [
      'Esterilização em Autoclave de Padrão Hospitalar',
      'Espaço Climatizado e Relaxante',
      'Profissionais Especializadas em Cada Área',
      'Fácil Localização e Acesso',
    ],
    schedulePlaceholder: 'Ex: Terça a Sábado das 09h às 19h',
    teamPlaceholder: 'Ex: Cabeleireiras, maquiadoras e designers com ampla experiência',
    specialCalloutLabel: 'Galeria Visual & Agendamento',
    specialCalloutDesc: 'Exibição de fotos reais dos procedimentos com canal direto para marcar horário.',
  },

  engenharia: {
    segmentKey: 'engenharia',
    name: 'Engenharia Civil & Arquitetura',
    icon: '📐',
    tagline: 'Construtoras, escritórios de arquitetura, reformas e perícias técnicas',
    defaultServicesPlaceholder: 'Ex: Projetos arquitetônicos residenciais, gerenciamento de obras, reformas corporativas...',
    primaryOptionsLabel: 'Tipos de Projetos / Serviços',
    primaryOptions: [
      'Projetos Arquitetônicos Residenciais',
      'Projetos Corporativos & Comerciais',
      'Construção Civil & Gestão de Obras',
      'Reformas & Design de Interiores',
      'Projetos Estruturais & Complementares',
      'Laudos Técnicos, Vistorias & Perícias',
      'Acompanhamento Técnico com R.T.',
      'Regularização de Imóveis & Alvarás',
    ],
    secondaryOptionsLabel: 'Apresentação Institucional',
    secondaryOptions: [
      'Portfólio com Fotos em Alta Definição',
      'Projetos em 3D & Maquetes Eletrônicas',
      'Metodologia e Etapas da Construção',
      'Canal de Solicitação de Proposta Técnica',
      'Certificações de Qualidade e Segurança',
    ],
    featuresLabel: 'Diferenciais da Empresa',
    features: [
      'Engenheiros e Arquitetos com CREA / CAU',
      'Pontualidade e Cumprimento Rígido de Prazos',
      'Contratos Claros com Cronograma Físico-Financeiro',
      'Obras com Limpeza e Organização Exemplares',
    ],
    schedulePlaceholder: 'Ex: Seg a Sex: 08h às 18h | Visitas técnicas com horário agendado',
    teamPlaceholder: 'Ex: Corpo técnico multidisciplinar com engenheiros, arquitetos e mestres de obras',
    specialCalloutLabel: 'Portfólio de Obras & Orçamentos',
    specialCalloutDesc: 'Construção de autoridade com obras entregues e formulário de orçamento.',
  },

  criador: {
    segmentKey: 'criador',
    name: 'Criador de Conteúdo & Mídia',
    icon: '📱',
    tagline: 'Influenciadores digitais, criadores de conteúdo, streamers e consultores',
    defaultServicesPlaceholder: 'Ex: Parcerias comerciais, mídia kit, cursos online, mentorias, podcasts...',
    primaryOptionsLabel: 'Foco de Atuação & Serviços',
    primaryOptions: [
      'Parcerias Comerciais & Publis',
      'Venda de Cursos & Infoprodutos',
      'Mentorias & Consultorias Individuais',
      'Palestas & Treinamentos Corporativos',
      'Canal do YouTube / Podcast Oficial',
      'Comunidade Exclusiva para Seguidores',
      'Mídia Kit com Métricas e Alcance',
      'Links Oficiais de Produtos e Descontos',
    ],
    secondaryOptionsLabel: 'Canais Principais',
    secondaryOptions: [
      'Instagram (Reels / Stories)',
      'Canal no YouTube',
      'TikTok',
      'LinkedIn Profissional',
      'Podcast no Spotify / Apple',
      'Newsletter / E-mail Marketing',
    ],
    featuresLabel: 'Recursos do Site',
    features: [
      'Link na Bio Centralizador de Alto Impacto',
      'Integração de Vídeos em Destaque',
      'Formulário Direto para Contato de Marcas',
      'Design Moderno e Alinhado com a Identidade Pessoal',
    ],
    schedulePlaceholder: 'Ex: Atendimento comercial de Segunda a Sexta das 09h às 18h',
    teamPlaceholder: 'Ex: Assessoria de imprensa e gestão comercial do criador',
    specialCalloutLabel: 'Autoridade & Contato Comercial',
    specialCalloutDesc: 'Página profissional para fechar contratos com marcas e guiar seguidores.',
  },

  sob_medida: {
    segmentKey: 'sob_medida',
    name: 'Projeto Sob Medida / Outro Segmento',
    icon: '💡',
    tagline: 'Empresas, startups, prestadores de serviços e ideias exclusivas',
    defaultServicesPlaceholder: 'Ex: Descreva a ideia do seu negócio, os produtos ou serviços que você oferece...',
    primaryOptionsLabel: 'Objetivo Principal do Projeto',
    primaryOptions: [
      'Apresentar a empresa com autoridade e credibilidade',
      'Gerar novos contatos e pedidos de orçamento diariamente',
      'Vender produtos ou serviços online',
      'Criar catálogo institucional moderno',
      'Substituir site antigo que não traz resultados',
      'Lançar um novo produto, serviço ou startup no mercado',
    ],
    secondaryOptionsLabel: 'Recursos Desejados',
    secondaryOptions: [
      'Botão Fixo de WhatsApp com Mensagem Personalizada',
      'Formulário de Contato com Triagem',
      'Galeria de Fotos / Trabalhos Concluídos',
      'Seção de Depoimentos & Clientes Atendidos',
      'Tabela de Preços ou Planos de Assinatura',
      'Mapa de Localização e Horários',
    ],
    featuresLabel: 'Diferenciais Pretendidos',
    features: [
      'Carregamento Ultra-Rápido no Celular',
      'Design Sob Medida e Exclusivo',
      'SEO Estruturado para o Google',
      'Textos Focados em Conversão de Clientes',
    ],
    schedulePlaceholder: 'Ex: Seg a Sex: 08h às 18h (ou horário comercial)',
    teamPlaceholder: 'Ex: Fundadores, diretores e equipe de atendimento',
    specialCalloutLabel: 'Briefing Flexível',
    specialCalloutDesc: 'Espaço aberto para detalhar sua visão sem restrições ou formulários complexos.',
  },

  prestador: {
    segmentKey: 'prestador',
    name: 'Prestador de Serviços',
    icon: '🛠️',
    tagline: 'Profissionais autônomos, assistências, manutenções e serviços em geral',
    defaultServicesPlaceholder: 'Ex: Instalações, manutenções preventivas, consultoria técnica, reparos e suporte...',
    primaryOptionsLabel: 'Serviços Prestados',
    primaryOptions: [
      'Manutenção Preventiva & Corretiva',
      'Instalação & Montagem Técnica',
      'Consultoria & Diagnóstico Especializado',
      'Atendimento Residencial & Corporativo',
      'Visita Técnica com Avaliação no Local',
      'Contratos Mensais de Manutenção',
      'Plantão de Emergência / Chamados Ágeis',
      'Reformas & Pequenos Reparos',
    ],
    secondaryOptionsLabel: 'Forma de Atendimento & Cobertura',
    secondaryOptions: [
      'Solicitação de Orçamento pelo WhatsApp',
      'Atendimento em Domicílio / Empresa',
      'Emissão de Nota Fiscal & Laudo Técnico',
      'Garantia Estendida dos Serviços',
      'Pagamento Facilitado no Cartão ou Pix',
    ],
    featuresLabel: 'Diferenciais do Prestador',
    features: [
      'Técnicos Certificados e Identificados',
      'Pontualidade e Compromisso de Horário',
      'Orçamento Transparente sem Surpresas',
      'Equipamentos e Ferramental Próprio',
    ],
    schedulePlaceholder: 'Ex: Seg a Sex: 08h às 18h | Sáb: 08h às 13h (Plantão sob consulta)',
    teamPlaceholder: 'Ex: Equipe de técnicos especializados com treinamento contínuo',
    specialCalloutLabel: 'Solicitação Rápida de Orçamento',
    specialCalloutDesc: 'Canal direto para o cliente descrever o problema e receber proposta.',
  },

  petshop: {
    segmentKey: 'petshop',
    name: 'Pet Shop & Veterinária',
    icon: '🐾',
    tagline: 'Pet shops, clínicas veterinárias, banho e tosa e cuidados animais',
    defaultServicesPlaceholder: 'Ex: Banho e tosa higiênica, hidratação de pelos, consultas veterinárias, vacinas...',
    primaryOptionsLabel: 'Serviços para Pets',
    primaryOptions: [
      'Banho Tradicional & Especial',
      'Tosa Higiênica, Máquina & Tesoura',
      'Hidratação & Cauterização de Pelagem',
      'Consultas Veterinárias de Rotina',
      'Vacinação & Aplicação de Vermífugos',
      'Táxi Dog / Leva e Traz com Segurança',
      'Hospedagem & Creche / Day Care Pet',
      'Petiscos, Rações & Acessórios',
    ],
    secondaryOptionsLabel: 'Cuidados & Facilidades',
    secondaryOptions: [
      'Agendamento Online com Hora Marcada',
      'Planos Mensais de Banhos com Desconto',
      'Ambiente com Monitoramento e Cuidado',
      'Toalhas Esterilizadas Individuais',
      'Atendimento Veterinário Preventivo',
    ],
    featuresLabel: 'Estrutura & Conforto Pet',
    features: [
      'Profissionais Apaixonados por Animais',
      'Cosméticos Veterinários Hipoalergênicos',
      'Espaço Climatizado e Anti-Estresse',
      'Salas Separadas para Cães e Gatos',
    ],
    schedulePlaceholder: 'Ex: Seg a Sáb das 08h às 18h',
    teamPlaceholder: 'Ex: Médicos veterinários, tosadores e banhistas certificados',
    specialCalloutLabel: 'Agendamento de Banho & Tosa',
    specialCalloutDesc: 'Formulário ágil para o tutor garantir o horário do pet sem filas.',
  },

  portfolio: {
    segmentKey: 'portfolio',
    name: 'Portfólio Profissional',
    icon: '💼',
    tagline: 'Portfólios autorais, criadores, designers, consultores e especialistas',
    defaultServicesPlaceholder: 'Ex: Projetos autorais, cases de clientes, consultorias de marca, palestras...',
    primaryOptionsLabel: 'Foco da Atuação Profissional',
    primaryOptions: [
      'Projetos Autorais & Design',
      'Consultorias Estratégicas & Mentoria',
      'Desenvolvimento de Software & Tech',
      'Fotografia & Produção Audiovisual',
      'Arquitetura & Design de Interiores',
      'Comunicação, Redação & Conteúdo',
      'Aulas, Palestras & Treinamentos',
      'Cases de Sucesso & Resultados Comprovados',
    ],
    secondaryOptionsLabel: 'Seções do Portfólio',
    secondaryOptions: [
      'Galeria de Projetos em Alta Resolução',
      'Estudos de Caso com Problema e Solução',
      'Biografia / Trajetória Profissional',
      'Depoimentos e Avaliações de Clientes',
      'Formulário para Contratação e Proposta',
    ],
    featuresLabel: 'Diferenciais de Autoridade',
    features: [
      'Visual Moderno de Alto Nível Estético',
      'Currículo e Habilidades em Destaque',
      'Carregamento Instantâneo das Imagens',
      'Links para Redes Sociais e LinkedIn',
    ],
    schedulePlaceholder: 'Ex: Atendimento comercial de Segunda a Sexta das 09h às 18h',
    teamPlaceholder: 'Ex: Profissional titular e parceiros estratégicos',
    specialCalloutLabel: 'Apresentação de Projetos & Contato',
    specialCalloutDesc: 'Vitrine de autoridade para atrair clientes de alto ticket e parcerias.',
  },

  landing_page: {
    segmentKey: 'landing_page',
    name: 'Landing Page de Alta Conversão',
    icon: '🎯',
    tagline: 'Páginas únicas focadas em conversão rápida de leads, vendas e lançamentos',
    defaultServicesPlaceholder: 'Ex: Oferta principal, benefícios exclusivos, garantia, depoimentos, botão de compra...',
    primaryOptionsLabel: 'Objetivo da Landing Page',
    primaryOptions: [
      'Captação de Leads Qualificados para Vendas',
      'Venda Direta de Produto ou Infoproduto',
      'Inscrição em Evento, Workshop ou Webinar',
      'Lançamento de Novo Produto ou Negócio',
      'Download de Material / Isca Digital',
      'Agendamento Direto no WhatsApp Comercial',
    ],
    secondaryOptionsLabel: 'Estrutura de Conversão',
    secondaryOptions: [
      'Dobra de Abertura com Headline e CTA Forte',
      'Benefícios Claros com Ícones em Destaque',
      'Depoimentos em Vídeo e Prints Reais',
      'Garantia Incondicional e Selos de Confiança',
      'Perguntas Frequentes em Acordeão (FAQ)',
      'Formulário Limpo e Otimizado para Mobile',
    ],
    featuresLabel: 'Diferenciais Técnicos',
    features: [
      'Velocidade Máxima de Carregamento no 4G/5G',
      'Copywriting Focado em Conversão e Persuasão',
      'Tags de Rastreamento (Google e Meta Pixel)',
      'Design Responsivo Perfeito no Smartphone',
    ],
    schedulePlaceholder: 'Ex: Página no ar 24h por dia gerando leads contínuos',
    teamPlaceholder: 'Ex: Equipe de vendas e atendimento via WhatsApp',
    specialCalloutLabel: 'Foco Total em Conversão',
    specialCalloutDesc: 'Design sem distrações, direcionando o visitante para a ação desejada.',
  },
};

/**
 * Normaliza qualquer segmento ou título de modelo em uma das chaves canônicas
 */
export function normalizeSegmentKey(segOrModel: string): string {
  const s = (segOrModel || '').toLowerCase().trim();

  if (s.includes('academi') || s.includes('fitness') || s.includes('treino') || s.includes('crossfit')) {
    return 'academia';
  }
  if (s.includes('restaurante') || s.includes('gastronom') || s.includes('pizza') || s.includes('burger') || s.includes('food') || s.includes('bistr')) {
    return 'restaurante';
  }
  if (s.includes('pet') || s.includes('vet') || s.includes('banho')) {
    return 'petshop';
  }
  if (s.includes('prestad') || s.includes('servico') || s.includes('serviço') || s.includes('oficina') || s.includes('assistenc')) {
    return 'prestador';
  }
  if (s.includes('landing') || s.includes('conversao') || s.includes('conversão')) {
    return 'landing_page';
  }
  if (s.includes('portfolio') || s.includes('portfólio') || s.includes('curriculo') || s.includes('case')) {
    return 'portfolio';
  }
  if (s.includes('clinic') || s.includes('clínic') || s.includes('saude') || s.includes('saúde') || s.includes('medic') || s.includes('médic') || s.includes('odonto')) {
    return 'clinica';
  }
  if (s.includes('imobil') || s.includes('imóve') || s.includes('imove') || s.includes('corretor') || s.includes('realestate')) {
    return 'imobiliaria';
  }
  if (s.includes('loja') || s.includes('comercio') || s.includes('comércio') || s.includes('varejo') || s.includes('ecommerce') || s.includes('e-commerce') || s.includes('retail')) {
    return 'loja';
  }
  if (s.includes('barbearia') || s.includes('barber') || s.includes('barba')) {
    return 'barbearia';
  }
  if (s.includes('salao') || s.includes('salão') || s.includes('beleza') || s.includes('estetica') || s.includes('estética') || s.includes('beauty') || s.includes('lumiere')) {
    return 'salao';
  }
  if (s.includes('engenhar') || s.includes('arquit') || s.includes('obra') || s.includes('constru')) {
    return 'engenharia';
  }
  if (s.includes('criador') || s.includes('influenc') || s.includes('creator') || s.includes('midia') || s.includes('mídia') || s.includes('vertex') || s.includes('tecnolog')) {
    return 'criador';
  }

  return 'sob_medida';
}

export function getCanonicalSegments(_lang: Language = "pt-BR"): Record<string, SegmentBriefingConfig> {
  return CANONICAL_SEGMENTS;
}

export function getSegmentConfig(segOrModel: string, lang: Language = 'pt-BR'): SegmentBriefingConfig {
  const key = normalizeSegmentKey(segOrModel);
  const segments = getCanonicalSegments(lang);
  return segments[key] || segments.sob_medida;
}
