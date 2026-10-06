import { ClientProject, ClientRequest, ProjectUpdate } from '../types';
import { Preferences } from '@capacitor/preferences';

const PORTAL_PROJECT_KEY = 'nexaweb_portal_active_project';
const PORTAL_SESSION_KEY = 'nexaweb_portal_session_token';
const ADMIN_SESSION_KEY = 'nexaweb_admin_session_token';
const PROJECTS_STORE_KEY = 'nexaweb_managed_projects';

// Mock inicial realista com histórico e solicitações completas
const DEFAULT_INITIAL_PROJECT: ClientProject = {
  id: 'proj-001',
  chaveAcesso: 'DEMO-2026',
  nomeCliente: 'Barbearia Imperial',
  nomeProjeto: 'Site Profissional Barbearia Imperial',
  planoId: 'profissional',
  status: 'em_andamento',
  etapaAtual: 'Desenvolvimento & Integrações',
  progresso: 75,
  mensagemStatus: 'Finalizamos o layout e estamos integrando o botão de agendamento ágil e otimizando os Core Web Vitals para carregamento instantâneo em 4G/5G.',
  versaoTesteUrl: 'https://king-s-barber-2-yn3c.vercel.app/',
  sitePublicadoUrl: 'https://barbearia-imperial.com.br',
  dataInicio: '01/10/2026',
  previsaoEntrega: '10/10/2026',
  historico: [
    {
      id: 'up-1',
      data: '01/10/2026',
      titulo: 'Briefing Recebido',
      descricao: 'Informações, cores e referências do cliente foram coletadas com sucesso.',
      status: 'concluido',
    },
    {
      id: 'up-2',
      data: '03/10/2026',
      titulo: 'Design & Estrutura Aprovados',
      descricao: 'Wireframe mobile e catálogo visual de cortes e barbas validados pelo cliente.',
      status: 'concluido',
    },
    {
      id: 'up-3',
      data: '05/10/2026',
      titulo: 'Desenvolvimento Frontend Mobile',
      descricao: 'Construção da interface responsiva com tecnologia moderna e zero layout shift.',
      status: 'concluido',
    },
    {
      id: 'up-4',
      data: 'Hoje',
      titulo: 'Otimização & Homologação',
      descricao: 'Validação de velocidade, SEO básico e botões diretos de atendimento.',
      status: 'em_progresso',
    },
  ],
  solicitacoes: [
    {
      id: 'req-1',
      projectId: 'proj-001',
      categoria: 'Troca de Conteúdo',
      assunto: 'Ajuste no horário de funcionamento',
      mensagem: 'Por favor, alterar nosso horário no rodapé para seg a sábado das 9h às 20h.',
      dataEnvio: '04/10/2026',
      status: 'respondido',
      respostaAdmin: 'Horário ajustado na versão de teste! Verifique na seção de rodapé da demonstração.',
      dataResposta: '04/10/2026',
    },
    {
      id: 'req-2',
      projectId: 'proj-001',
      categoria: 'Ajuste de Design',
      assunto: 'Inserir botão para o Instagram',
      mensagem: 'Gostaria de incluir o link @barbeariaimperial ao lado do botão de agendamento.',
      dataEnvio: '05/10/2026',
      status: 'respondido',
      respostaAdmin: 'Link do Instagram integrado com sucesso e já ativo no cabeçalho e rodapé!',
      dataResposta: '05/10/2026',
    },
    {
      id: 'req-briefing',
      projectId: 'proj-001',
      categoria: 'Briefing',
      assunto: 'Briefing Inicial Homologado',
      mensagem: 'Segmento Barbearia, Plano Profissional, identidade visual moderna com foco em agendamento.',
      dataEnvio: '01/10/2026',
      status: 'respondido',
      respostaAdmin: 'Briefing inicial validado pela equipe e inserido no ciclo de desenvolvimento.',
      dataResposta: '01/10/2026',
    },
  ],
};

const SECOND_PROJECT: ClientProject = {
  id: 'proj-002',
  chaveAcesso: 'NEXA-7789',
  nomeCliente: 'Studio Lumina Estética',
  nomeProjeto: 'Portal & Catálogo Estético Lumina',
  planoId: 'premium',
  status: 'desenvolvimento',
  etapaAtual: 'Direção de Arte & Copywriting',
  progresso: 45,
  mensagemStatus: 'Produzindo as microinterações de alto luxo e refinando a apresentação dos procedimentos faciais.',
  versaoTesteUrl: 'https://sal-o-premium.vercel.app/',
  sitePublicadoUrl: '',
  dataInicio: '03/10/2026',
  previsaoEntrega: '14/10/2026',
  historico: [
    {
      id: 'up-201',
      data: '03/10/2026',
      titulo: 'Kickoff do Projeto Premium',
      descricao: 'Alinhamento da identidade visual sofisticada e catálogo de serviços.',
      status: 'concluido',
    },
    {
      id: 'up-202',
      data: 'Hoje',
      titulo: 'Design Visual & Paleta',
      descricao: 'Criação dos layouts com tipografia de luxo e contraste refinado.',
      status: 'em_progresso',
    },
  ],
  solicitacoes: [
    {
      id: 'req-201',
      projectId: 'proj-002',
      categoria: 'Troca de Conteúdo',
      assunto: 'Fotos dos procedimentos',
      mensagem: 'Enviei fotos em alta resolução pelo e-mail, conseguem incluir na galeria?',
      dataEnvio: '05/10/2026',
      status: 'em_analise',
      respostaAdmin: 'Fotos recebidas! Estamos otimizando o peso das imagens em formato WebP para não impactar a velocidade.',
      dataResposta: '05/10/2026',
    },
    {
      id: 'req-briefing-2',
      projectId: 'proj-002',
      categoria: 'Briefing',
      assunto: 'Briefing de Identidade Visual & Luxo',
      mensagem: 'Segmento Estética & Beleza, Plano Premium, foco em sofisticação e conversão mobile.',
      dataEnvio: '03/10/2026',
      status: 'respondido',
      respostaAdmin: 'Briefing homologado e direção de arte iniciada.',
      dataResposta: '03/10/2026',
    },
  ],
};

// Obter todos os projetos gerenciados (persiste localmente)
export async function getAllProjects(): Promise<ClientProject[]> {
  try {
    const raw = localStorage.getItem(PROJECTS_STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }

  const initial = [DEFAULT_INITIAL_PROJECT, SECOND_PROJECT];
  saveAllProjects(initial);
  return initial;
}

export function saveAllProjects(projects: ClientProject[]): void {
  try {
    localStorage.setItem(PROJECTS_STORE_KEY, JSON.stringify(projects));
  } catch {
    // fallback
  }
}

// ---------------- CLIENT PORTAL METHODS ---------------- //

export async function loginClientPortal(chaveAcesso: string): Promise<ClientProject | null> {
  const cleanKey = chaveAcesso.trim().toUpperCase();

  // 1. Tentar chamada à API oficial se disponível
  try {
    const res = await fetch('/api/portal-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessKey: cleanKey }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.project) {
        await saveClientSession(cleanKey, data.project);
        return data.project;
      }
    }
  } catch {
    // Se a API externa não responder ou estiver offline no mobile, usa o banco local sincronizado
  }

  // 2. Busca no banco de dados local
  const projects = await getAllProjects();
  const matched = projects.find(
    (p) => p.chaveAcesso.toUpperCase() === cleanKey || cleanKey === 'DEMO' || cleanKey === 'DEMO-2026'
  );

  if (matched) {
    await saveClientSession(matched.chaveAcesso, matched);
    return matched;
  }

  // Se o usuário digitou qualquer chave válida com 4+ caracteres, cria uma visualização do projeto dele
  if (cleanKey.length >= 4) {
    const customProject: ClientProject = {
      id: `proj-${Date.now()}`,
      chaveAcesso: cleanKey,
      nomeCliente: `Cliente ${cleanKey}`,
      nomeProjeto: `Projeto NexaWeb #${cleanKey}`,
      planoId: 'profissional',
      status: 'planejamento',
      etapaAtual: 'Alinhamento Inicial',
      progresso: 25,
      mensagemStatus: 'Seu projeto está em fase de planejamento técnico e aprovação do escopo com a equipe NexaWeb.',
      dataInicio: new Date().toLocaleDateString('pt-BR'),
      previsaoEntrega: '7 dias úteis',
      historico: [
        {
          id: 'up-init',
          data: 'Hoje',
          titulo: 'Chave de Acesso Ativada',
          descricao: 'Projeto registrado no sistema da NexaWeb.',
          status: 'concluido',
        },
      ],
      solicitacoes: [],
    };
    projects.push(customProject);
    saveAllProjects(projects);
    await saveClientSession(cleanKey, customProject);
    return customProject;
  }

  return null;
}

export async function getSavedClientSession(): Promise<ClientProject | null> {
  try {
    const { value } = await Preferences.get({ key: PORTAL_PROJECT_KEY });
    if (value) {
      return JSON.parse(value);
    }
    const local = localStorage.getItem(PORTAL_PROJECT_KEY);
    if (local) return JSON.parse(local);
  } catch {
    const local = localStorage.getItem(PORTAL_PROJECT_KEY);
    if (local) return JSON.parse(local);
  }
  return null;
}

export async function registerClientProjectFromBriefing(
  projectId: string,
  clientName: string,
  businessName: string,
  planId: string,
  notes?: string
): Promise<ClientProject> {
  const projects = await getAllProjects();
  const cleanKey = projectId.trim().toUpperCase();
  const newProject: ClientProject = {
    id: cleanKey,
    chaveAcesso: cleanKey,
    nomeCliente: clientName.trim() || 'Cliente NexaWeb',
    nomeProjeto: businessName.trim() || 'Meu Site Profissional',
    planoId: planId,
    status: 'planejamento',
    etapaAtual: 'Briefing Recebido',
    progresso: 15,
    mensagemStatus: 'Seu briefing foi registrado com sucesso. Nossa equipe iniciará a análise técnica e o alinhamento da estrutura do seu site.',
    dataInicio: new Date().toLocaleDateString('pt-BR'),
    previsaoEntrega: '7 a 10 dias úteis',
    historico: [
      {
        id: `hist-brief-${Date.now()}`,
        data: 'Hoje',
        titulo: 'Briefing Oficial Recebido',
        descricao: 'Briefing e especificações do projeto registrados no aplicativo.',
        status: 'concluido',
      },
    ],
    solicitacoes: notes
      ? [
          {
            id: `req-init-${Date.now()}`,
            projectId: cleanKey,
            categoria: 'Briefing',
            assunto: 'Envio de Briefing Inicial',
            mensagem: notes,
            dataEnvio: new Date().toLocaleDateString('pt-BR'),
            status: 'pendente',
          },
        ]
      : [],
  };

  const existingIdx = projects.findIndex((p) => p.chaveAcesso.toUpperCase() === cleanKey);
  if (existingIdx !== -1) {
    projects[existingIdx] = newProject;
  } else {
    projects.push(newProject);
  }

  saveAllProjects(projects);
  await saveClientSession(cleanKey, newProject);
  return newProject;
}

export async function saveClientSession(token: string, project: ClientProject): Promise<void> {
  const json = JSON.stringify(project);
  try {
    await Preferences.set({ key: PORTAL_SESSION_KEY, value: token });
    await Preferences.set({ key: PORTAL_PROJECT_KEY, value: json });
  } catch {
    // fallback
  }
  localStorage.setItem(PORTAL_SESSION_KEY, token);
  localStorage.setItem(PORTAL_PROJECT_KEY, json);
}

export async function logoutClientPortal(): Promise<void> {
  try {
    await Preferences.remove({ key: PORTAL_SESSION_KEY });
    await Preferences.remove({ key: PORTAL_PROJECT_KEY });
  } catch {
    // fallback
  }
  localStorage.removeItem(PORTAL_SESSION_KEY);
  localStorage.removeItem(PORTAL_PROJECT_KEY);
}

export async function submitClientRequest(
  projectId: string,
  assunto: string,
  mensagem: string,
  categoria: string = 'Outro'
): Promise<ClientRequest> {
  // 1. Tentar chamada à API remota
  try {
    const res = await fetch('/api/portal-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, assunto, mensagem, categoria }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.request) return data.request;
    }
  } catch {
    // prossegue com persistência local
  }

  const newReq: ClientRequest = {
    id: `req-${Date.now()}`,
    projectId,
    categoria,
    assunto: assunto.trim(),
    mensagem: mensagem.trim(),
    dataEnvio: new Date().toLocaleDateString('pt-BR'),
    status: 'pendente',
  };

  const projects = await getAllProjects();
  const target = projects.find((p) => p.id === projectId);
  if (target) {
    if (!target.solicitacoes) target.solicitacoes = [];
    target.solicitacoes.unshift(newReq);
    saveAllProjects(projects);
    // Atualiza sessão ativa se for o mesmo projeto
    const currentSession = await getSavedClientSession();
    if (currentSession && currentSession.id === projectId) {
      currentSession.solicitacoes.unshift(newReq);
      saveClientSession(currentSession.chaveAcesso, currentSession);
    }
  }

  return newReq;
}

// ---------------- ADMIN PORTAL METHODS ---------------- //

export async function loginAdmin(password: string): Promise<boolean> {
  const clean = password.trim();
  // Aceita senhas padrão e de teste oficiais
  const isValid =
    clean === 'admin' ||
    clean === 'admin2026' ||
    clean === 'nexaweb' ||
    clean === 'nexaweb-admin' ||
    clean === '123456';

  if (isValid) {
    try {
      await Preferences.set({ key: ADMIN_SESSION_KEY, value: 'admin-authorized-token' });
    } catch {
      // fallback
    }
    localStorage.setItem(ADMIN_SESSION_KEY, 'admin-authorized-token');
    return true;
  }
  return false;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const { value } = await Preferences.get({ key: ADMIN_SESSION_KEY });
    if (value) return true;
  } catch {
    // fallback
  }
  return localStorage.getItem(ADMIN_SESSION_KEY) !== null;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await Preferences.remove({ key: ADMIN_SESSION_KEY });
  } catch {
    // fallback
  }
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

// Admin atualiza o status/progresso de um projeto
export async function updateProjectByAdmin(
  projectId: string,
  updates: Partial<ClientProject>
): Promise<ClientProject | null> {
  const projects = await getAllProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return null;

  projects[index] = { ...projects[index], ...updates };
  saveAllProjects(projects);

  // Sincroniza se o cliente estiver conectado com este projeto
  const currentSession = await getSavedClientSession();
  if (currentSession && currentSession.id === projectId) {
    const updatedSession = { ...currentSession, ...updates };
    saveClientSession(updatedSession.chaveAcesso, updatedSession);
  }

  return projects[index];
}

// Admin responde a uma solicitação do cliente
export async function replyToClientRequest(
  projectId: string,
  requestId: string,
  respostaAdmin: string
): Promise<boolean> {
  const projects = await getAllProjects();
  const proj = projects.find((p) => p.id === projectId);
  if (!proj) return false;

  const req = proj.solicitacoes.find((r) => r.id === requestId);
  if (!req) return false;

  req.respostaAdmin = respostaAdmin.trim();
  req.dataResposta = new Date().toLocaleDateString('pt-BR');
  req.status = 'respondido';

  saveAllProjects(projects);

  // Sincroniza sessão do cliente se ativa
  const currentSession = await getSavedClientSession();
  if (currentSession && currentSession.id === projectId) {
    const sessReq = currentSession.solicitacoes.find((r) => r.id === requestId);
    if (sessReq) {
      sessReq.respostaAdmin = respostaAdmin.trim();
      sessReq.dataResposta = req.dataResposta;
      sessReq.status = 'respondido';
      saveClientSession(currentSession.chaveAcesso, currentSession);
    }
  }

  return true;
}
