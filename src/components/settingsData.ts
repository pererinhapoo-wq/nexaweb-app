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

export function getHelpFaq(lang: Language): HelpItem[] {
  if (lang === 'en') {
    return [
      {
        title: 'How does creating my website work?',
        content:
          'You can explore the Showcase Demos in the Portfolio, select a reference model, or request a bespoke project. Next, complete the Briefing wizard with your company details. Our team analyzes the information and reaches out to align timelines and start development.',
      },
      {
        title: 'Which plan should I choose for my business?',
        content:
          '• Essential Plan (from R$ 1.000): Ideal for high-converting landing pages focused on direct customer acquisition.\n• Professional Plan (from R$ 1.700): Complete institutional website with catalog, structured sections, appointments and Google SEO for strong authority.\n• Custom / Premium Plan: Tailored architecture with bespoke integrations and VIP capabilities.',
      },
      {
        title: 'How do I fill out the Briefing?',
        content:
          'The Briefing is divided into intuitive steps: business segment, commercial goals, required features, and visual style preferences. You don’t need to answer everything at once: your draft is saved automatically on your device so you can resume whenever you like.',
      },
      {
        title: 'What happens after submitting the Briefing?',
        content:
          'Our technical team validates requirements, calculates the timeline, and contacts you via WhatsApp or email with the official commercial proposal. No charge is made prior to your formal approval.',
      },
      {
        title: 'How can I track the progress of my website?',
        content:
          'In the Client Area tab, you can enter your project’s exclusive Access Key to track milestones in real time: briefing, design, development, approval, and launch.',
      },
    ];
  }

  if (lang === 'es') {
    return [
      {
        title: '¿Cómo funciona la creación de mi sitio web?',
        content:
          'Puede explorar la Vitrina de Demostraciones en el Portafolio, elegir un modelo de referencia o solicitar un proyecto a medida. Luego, complete el asistente de Briefing con los datos de su empresa. Nuestro equipo analiza la información y se pone en contacto para alinear plazos e iniciar el desarrollo.',
      },
      {
        title: '¿Qué plan elegir para mi negocio?',
        content:
          '• Plan Esencial (a partir de R$ 1.000): Ideal para landing pages de alta conversión enfocadas en captación directa de clientes y negocios locales.\n• Plan Profesional (a partir de R$ 1.700): Sitio institucional completo con catálogo, secciones estructuradas, reservas y SEO para presencia sólida.\n• Plan Personalizado / Premium: Estructura a medida con integraciones exclusivas y recursos VIP.',
      },
      {
        title: '¿Cómo completar el Briefing?',
        content:
          'El Briefing está organizado en etapas intuitivas: sector de la empresa, objetivos comerciales, funcionalidades necesarias y preferencias de identidad visual. No necesita responder todo a la vez: su borrador se guarda automáticamente en el dispositivo para que lo retome cuando quiera.',
      },
      {
        title: '¿Qué sucede después de enviar el Briefing?',
        content:
          'Nuestro equipo técnico valida los requisitos, calcula los plazos estimados y se comunica vía WhatsApp o correo electrónico con la propuesta comercial oficial. No se realiza ningún cobro antes de su aprobación formal.',
      },
      {
        title: '¿Cómo seguir el avance de mi sitio web?',
        content:
          'En la pestaña Área del Cliente, puede ingresar la clave de acceso exclusiva de su proyecto para seguir las etapas en tiempo real: briefing, diseño, desarrollo, homologación y publicación.',
      },
    ];
  }

  if (lang === 'fr') {
    return [
      {
        title: 'Comment fonctionne la création de mon site web ?',
        content:
          'Vous pouvez parcourir la Galerie de Démonstrations dans le Portfolio, choisir un modèle de référence ou demander un projet sur mesure. Ensuite, remplissez le Briefing interactif avec les détails de votre entreprise. Notre équipe étudie vos éléments et prend contact pour planifier les délais et lancer la conception.',
      },
      {
        title: 'Quelle formule choisir pour mon entreprise ?',
        content:
          '• Formule Essentielle (à partir de R$ 1.000) : Idéale pour les landing pages à forte conversion axées sur l’acquisition directe de clients.\n• Formule Professionnelle (à partir de R$ 1.700) : Site vitrine complet avec catalogue, rubriques structurées, prise de rendez-vous et référencement SEO.\n• Formule Sur Mesure / Premium : Architecture personnalisée avec intégrations sur mesure et services VIP exclusifs.',
      },
      {
        title: 'Comment remplir le Briefing ?',
        content:
          'Le Briefing est divisé en étapes intuitives : secteur d’activité, objectifs commerciaux, fonctionnalités requises et style visuel. Vous n’avez pas besoin de tout remplir d’un coup : votre brouillon est automatiquement sauvegardé sur votre appareil pour reprendre à tout moment.',
      },
      {
        title: 'Que se passe-t-il après l’envoi du Briefing ?',
        content:
          'Notre équipe technique valide vos besoins, estime les délais et vous contacte via WhatsApp ou email avec la proposition commerciale officielle. Aucun paiement n’est requis avant votre accord formel.',
      },
      {
        title: 'Comment suivre l’avancement de mon site ?',
        content:
          'Dans l’onglet Espace Client, saisissez la clé d’accès exclusive de votre projet pour suivre l’évolution en temps réel : briefing, design, développement, validation et mise en ligne.',
      },
    ];
  }

  if (lang === 'pt-PT') {
    return [
      {
        title: 'Como funciona a criação do meu sítio web?',
        content:
          'Pode navegar pela Montra de Demonstrações no Portfólio, escolher um modelo de referência ou solicitar um projeto à medida. De seguida, preencha o assistente de Briefing com os detalhes da sua empresa. A nossa equipa analisa as informações e entra em contacto para alinhar prazos e iniciar o desenvolvimento.',
      },
      {
        title: 'Qual o plano a escolher para o meu negócio?',
        content:
          '• Plano Essencial (a partir de R$ 1.000): Ideal para Landing Pages de alta conversão, focadas na angariação direta de clientes e negócios locais.\n• Plano Profissional (a partir de R$ 1.700): Sítio institucional completo com catálogo, secções estruturadas, agendamento e SEO para presença forte.\n• Plano Personalizado / Premium: Estrutura personalizada com integrações sob medida e recursos exclusivos.',
      },
      {
        title: 'Como preencher o Briefing?',
        content:
          'O Briefing é organizado em etapas intuitivas: segmento da empresa, objetivos comerciais, funcionalidades necessárias e preferências de identidade visual. O seu rascunho é guardado automaticamente na aplicação para retomar quando desejar.',
      },
      {
        title: 'O que acontece após o envio do Briefing?',
        content:
          'A nossa equipa técnica valida os requisitos, calcula a estimativa de prazo e entra em contacto via WhatsApp ou correio eletrónico com a proposta comercial oficial. Nenhuma cobrança é realizada antes da sua aprovação formal.',
      },
      {
        title: 'Como acompanhar o progresso do meu sítio web?',
        content:
          'No separador Área do Cliente, pode inserir a chave de acesso exclusiva do seu projeto para acompanhar as etapas em tempo real: briefing, design, desenvolvimento, homologação e publicação.',
      },
    ];
  }

  // pt-BR padrão
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

export function getFeedbackTypes(lang: Language): FeedbackTypeOption[] {
  if (lang === 'en') {
    return [
      { id: 'Sugestão', label: 'Suggestion' },
      { id: 'Relatar problema', label: 'Report Issue' },
      { id: 'Elogio', label: 'Compliment' },
      { id: 'Outro', label: 'Other' },
    ];
  }
  if (lang === 'es') {
    return [
      { id: 'Sugestão', label: 'Sugerencia' },
      { id: 'Relatar problema', label: 'Reportar problema' },
      { id: 'Elogio', label: 'Felicitación' },
      { id: 'Outro', label: 'Otro' },
    ];
  }
  if (lang === 'fr') {
    return [
      { id: 'Sugestão', label: 'Suggestion' },
      { id: 'Relatar problema', label: 'Signaler un problème' },
      { id: 'Elogio', label: 'Compliment' },
      { id: 'Outro', label: 'Autre' },
    ];
  }
  if (lang === 'pt-PT') {
    return [
      { id: 'Sugestão', label: 'Sugestão' },
      { id: 'Relatar problema', label: 'Reportar problema' },
      { id: 'Elogio', label: 'Elogio' },
      { id: 'Outro', label: 'Outro' },
    ];
  }
  return [
    { id: 'Sugestão', label: 'Sugestão' },
    { id: 'Relatar problema', label: 'Relatar problema' },
    { id: 'Elogio', label: 'Elogio' },
    { id: 'Outro', label: 'Outro' },
  ];
}

export function getPrivacyData(lang: Language): PrivacyData {
  if (lang === 'en') {
    return {
      title: 'Privacy Policy',
      subtitle: 'Commitment to the security and privacy of your information',
      cardTitle: 'Privacy Policy & Data',
      cardBadge: 'NexaWeb Guidelines',
      statusTitle: 'Formal Policy Status:',
      statusDesc:
        'The comprehensive formal Privacy Policy is being legally structured for official publication on nexaweeb.vercel.app.',
      commitmentsTitle: 'Current NexaWeb commitments:',
      commitments: [
        {
          title: 'Exclusive commercial purpose:',
          desc: 'Information provided in the briefing (name, phone, company, preferences) is used solely for project proposals and client service.',
        },
        {
          title: 'No data sharing:',
          desc: 'We never sell, rent, or share your personal data with third parties or advertisers.',
        },
        {
          title: 'Secure draft storage:',
          desc: 'Your briefing draft is stored exclusively in your device’s local storage, never transmitted without your explicit submission.',
        },
      ],
      contactNote:
        'For any questions regarding privacy and data processing, please contact nexaweeb@gmail.com.',
    };
  }

  if (lang === 'es') {
    return {
      title: 'Privacidad',
      subtitle: 'Compromiso con la seguridad y privacidad de su información',
      cardTitle: 'Política de Privacidad & Datos',
      cardBadge: 'Directrices de NexaWeb',
      statusTitle: 'Estado de la Política Formal:',
      statusDesc:
        'El documento formal completo de la Política de Privacidad está en proceso de estructuración jurídica para publicación oficial en nexaweeb.vercel.app.',
      commitmentsTitle: 'Compromisos vigentes de NexaWeb:',
      commitments: [
        {
          title: 'Finalidad comercial exclusiva:',
          desc: 'La información proporcionada en el briefing (nombre, teléfono, empresa, preferencias) se utiliza únicamente para el presupuesto y la atención de su proyecto.',
        },
        {
          title: 'No compartición:',
          desc: 'No vendemos, no alquilamos y no compartimos sus datos con terceros ni anunciantes.',
        },
        {
          title: 'Almacenamiento seguro del borrador:',
          desc: 'El borrador del formulario de briefing se guarda exclusivamente en el almacenamiento local de su dispositivo y no se envía sin su acción explícita.',
        },
      ],
      contactNote:
        'Para cualquier duda sobre privacidad y tratamiento de datos, escriba a nexaweeb@gmail.com.',
    };
  }

  if (lang === 'fr') {
    return {
      title: 'Confidentialité',
      subtitle: 'Engagement pour la sécurité et la confidentialité de vos données',
      cardTitle: 'Politique de Confidentialité & Données',
      cardBadge: 'Directives NexaWeb',
      statusTitle: 'Statut du Document Formel :',
      statusDesc:
        'Le document formel complet de politique de confidentialité est en cours de structuration juridique pour publication sur nexaweeb.vercel.app.',
      commitmentsTitle: 'Engagements en vigueur de NexaWeb :',
      commitments: [
        {
          title: 'Finalité commerciale exclusive :',
          desc: 'Les informations renseignées dans le briefing (nom, téléphone, entreprise, préférences) sont utilisées uniquement pour l’élaboration de la proposition et le suivi de votre projet.',
        },
        {
          title: 'Aucun partage de données :',
          desc: 'Nous ne vendons, ne louons et ne transmettons aucune donnée personnelle à des tiers ou régies publicitaires.',
        },
        {
          title: 'Stockage sécurisé du brouillon :',
          desc: 'Le brouillon de votre briefing est conservé uniquement dans le stockage local de votre appareil et n’est pas transmis sans votre validation.',
        },
      ],
      contactNote:
        'Pour toute question relative à la confidentialité et au traitement des données, écrivez à nexaweeb@gmail.com.',
    };
  }

  if (lang === 'pt-PT') {
    return {
      title: 'Privacidade',
      subtitle: 'Compromisso com a segurança e privacidade das suas informações',
      cardTitle: 'Política de Privacidade & Dados',
      cardBadge: 'Diretrizes da NexaWeb',
      statusTitle: 'Estado da Política Formal:',
      statusDesc:
        'O documento formal completo da Política de Privacidade está em processo de estruturação jurídica para publicação oficial em nexaweeb.vercel.app.',
      commitmentsTitle: 'Compromissos vigentes da NexaWeb:',
      commitments: [
        {
          title: 'Finalidade comercial exclusiva:',
          desc: 'As informações fornecidas no briefing (nome, telefone, empresa, preferências) são utilizadas apenas para alinhamento de propostas e atendimento ao seu projeto.',
        },
        {
          title: 'Não partilha:',
          desc: 'Não vendemos, não alugamos e não partilhamos os seus dados com terceiros ou anunciantes.',
        },
        {
          title: 'Armazenamento seguro do rascunho:',
          desc: 'O rascunho do formulário de briefing fica guardado exclusivamente no armazenamento local do seu próprio dispositivo, não sendo transmitido sem o seu envio.',
        },
      ],
      contactNote:
        'Para esclarecer qualquer dúvida sobre privacidade e tratamento de dados, escreva para nexaweeb@gmail.com.',
    };
  }

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

export function getTermsData(lang: Language): TermsData {
  if (lang === 'en') {
    return {
      title: 'Terms of Use',
      subtitle: 'General conditions of service and project contracting',
      cardTitle: 'Terms & Conditions of Service',
      cardBadge: 'Professional websites contracting',
      statusTitle: 'Formal Terms Status:',
      statusDesc:
        'General formal service terms are undergoing final contractual consolidation and can be consulted directly with our specialists during proposal validation.',
      guidelinesTitle: 'Applicable general guidelines:',
      guidelines: [
        {
          title: 'Commercial transparency:',
          desc: 'All plans (Essential, Professional, Custom), base prices and add-on features are clearly detailed in the Services and Briefing tabs.',
        },
        {
          title: 'Prior validation:',
          desc: 'Every project requires mutual approval of the commercial proposal and delivery schedule before any payment or final delivery.',
        },
        {
          title: 'Showcase demos:',
          desc: 'Interactive showcase projects displayed in the portfolio are concept demonstrations highlighting agency quality and technical capabilities.',
        },
      ],
      contactNote:
        'Commercial inquiries or formal agreement requests can be sent to nexaweeb@gmail.com.',
    };
  }

  if (lang === 'es') {
    return {
      title: 'Términos de Uso',
      subtitle: 'Condiciones generales de servicio y contratación de proyectos',
      cardTitle: 'Términos & Condiciones de Servicio',
      cardBadge: 'Contratación de sitios profesionales',
      statusTitle: 'Estado de los Términos Formales:',
      statusDesc:
        'Los términos generales formales de contratación están en proceso de consolidación contractual y pueden consultarse directamente con nuestros especialistas durante la validación de la propuesta.',
      guidelinesTitle: 'Directrices generales aplicables:',
      guidelines: [
        {
          title: 'Transparencia comercial:',
          desc: 'Todos los planes (Esencial, Profesional, Personalizado), precios base y recursos adicionales se informan con claridad en Servicios y Briefing.',
        },
        {
          title: 'Validación previa:',
          desc: 'Todo proyecto depende de la aprobación mutua de la propuesta comercial y el cronograma antes de cualquier cobro o entrega.',
        },
        {
          title: 'Demostraciones conceptuales:',
          desc: 'Los proyectos interactivos del portafolio son modelos de demostración para presentar la calidad y capacidades técnicas de la agencia.',
        },
      ],
      contactNote:
        'Dudas comerciales o solicitudes de contrato formal pueden enviarse a nexaweeb@gmail.com.',
    };
  }

  if (lang === 'fr') {
    return {
      title: 'Conditions d’Utilisation',
      subtitle: 'Conditions générales de service et passation de projets',
      cardTitle: 'Conditions Générales de Service',
      cardBadge: 'Passation de sites professionnels',
      statusTitle: 'Statut des Conditions Formelles :',
      statusDesc:
        'Les conditions contractuelles générales sont en cours de consolidation juridique et peuvent être consultées directement avec nos spécialistes lors de la validation du devis.',
      guidelinesTitle: 'Directives générales applicables :',
      guidelines: [
        {
          title: 'Transparence commerciale :',
          desc: 'Toutes les formules (Essentielle, Professionnelle, Sur mesure), tarifs de base et options sont détaillés en toute transparence dans les onglets Formules et Briefing.',
        },
        {
          title: 'Validation préalable :',
          desc: 'Chaque projet fait l’objet d’un accord mutuel sur la proposition et le planning avant tout paiement ou livraison définitive.',
        },
        {
          title: 'Démonstrations de présentation :',
          desc: 'Les projets interactifs présentés dans le portfolio sont des modèles de démonstration illustrant le savoir-faire de l’agence.',
        },
      ],
      contactNote:
        'Les demandes d’information ou de contrat formalisé peuvent être envoyées à nexaweeb@gmail.com.',
    };
  }

  if (lang === 'pt-PT') {
    return {
      title: 'Termos de Utilização',
      subtitle: 'Condições gerais de serviço e contratação de projetos',
      cardTitle: 'Termos & Condições de Serviço',
      cardBadge: 'Contratação de sítios profissionais',
      statusTitle: 'Estado dos Termos Formais:',
      statusDesc:
        'Os termos gerais formais de contratação estão em fase de consolidação contratual e podem ser consultados diretamente com os nossos especialistas durante a validação da proposta.',
      guidelinesTitle: 'Diretrizes gerais aplicáveis:',
      guidelines: [
        {
          title: 'Transparência comercial:',
          desc: 'Todos os planos (Essencial, Profissional, Personalizado), valores base e recursos adicionais são informados com clareza nos Serviços e Briefing.',
        },
        {
          title: 'Validação prévia:',
          desc: 'Todo o projeto depende da aprovação mútua da proposta comercial e do cronograma antes de qualquer cobrança ou entrega definitiva.',
        },
        {
          title: 'Demonstrações conceituais:',
          desc: 'Os projetos interativos exibidos no portfólio são modelos de demonstração para apresentar a qualidade e as capacidades técnicas da agência.',
        },
      ],
      contactNote:
        'Dúvidas comerciais ou pedidos de contrato formal podem ser enviados para nexaweeb@gmail.com.',
    };
  }

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
