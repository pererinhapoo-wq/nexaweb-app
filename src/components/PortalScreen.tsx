import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ClientProject, ClientRequest, RequestCategory } from '../types';
import {
  loginClientPortal,
  getSavedClientSession,
  logoutClientPortal,
  submitClientRequest,
} from '../utils/portalService';
import {
  UserCheck,
  KeyRound,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  LogOut,
  Sparkles,
  ArrowRight,
  ArrowDown,
  PlusCircle,
  X,
  FileText,
  Calendar,
  ShieldCheck,
  Layers,
  ChevronRight,
  Palette,
  Code,
  Eye,
  Globe,
  Tag,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

// 6 Etapas Oficiais NexaWeb
const NEXAWEB_STAGES = [
  { id: 'briefing', label: 'Briefing', icon: FileText, desc: 'Alinhamento de objetivo, público e referências' },
  { id: 'estrutura', label: 'Estrutura', icon: Layers, desc: 'Wireframe, arquitetura de páginas e seções' },
  { id: 'design', label: 'Design', icon: Palette, desc: 'Identidade visual moderna e layout mobile first' },
  { id: 'desenvolvimento', label: 'Desenvolvimento', icon: Code, desc: 'Codificação de alta performance e responsividade' },
  { id: 'revisao', label: 'Revisão', icon: Eye, desc: 'Homologação, testes e validação técnica' },
  { id: 'publicado', label: 'Publicado', icon: Globe, desc: 'Site oficial no ar com domínio e velocidade' },
] as const;

// Categorias Oficiais para Nova Solicitação
const REQUEST_CATEGORIES: { id: RequestCategory; label: string; icon: string }[] = [
  { id: 'Ajuste de Design', label: 'Ajuste de Design', icon: '🎨' },
  { id: 'Troca de Conteúdo', label: 'Troca de Conteúdo', icon: '📝' },
  { id: 'Dúvida', label: 'Dúvida', icon: '❓' },
  { id: 'Correção', label: 'Correção', icon: '🔧' },
  { id: 'Outro', label: 'Outro', icon: '💬' },
];

export const PortalScreen: React.FC = () => {
  const { t } = useTranslation();
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [project, setProject] = useState<ClientProject | null>(null);

  // Modal para nova solicitação
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqCategory, setReqCategory] = useState<RequestCategory>('Ajuste de Design');
  const [reqSubject, setReqSubject] = useState('');
  const [reqMessage, setReqMessage] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);
  const [reqSuccessMsg, setReqSuccessMsg] = useState<string | null>(null);
  const reqSuccessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (reqSuccessTimerRef.current) clearTimeout(reqSuccessTimerRef.current);
    };
  }, []);

  // Carrega sessão salva
  useEffect(() => {
    async function loadSession() {
      const saved = await getSavedClientSession();
      if (saved) {
        setProject(saved);
      }
    }
    loadSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) {
      setErrorMsg('Por favor, informe sua chave de acesso.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const proj = await loginClientPortal(accessKey);
      if (proj) {
        setProject(proj);
      } else {
        setErrorMsg('Chave de acesso não encontrada. Use DEMO-2026 para demonstração.');
      }
    } catch {
      setErrorMsg('Falha ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutClientPortal();
    setProject(null);
    setAccessKey('');
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !reqSubject.trim() || !reqMessage.trim()) return;

    setSubmittingReq(true);
    try {
      const newReq = await submitClientRequest(
        project.id,
        reqSubject.trim(),
        reqMessage.trim(),
        reqCategory
      );
      setProject({
        ...project,
        solicitacoes: [newReq, ...(project.solicitacoes || [])],
      });
      setReqSubject('');
      setReqMessage('');
      setReqCategory('Ajuste de Design');
      setIsRequestModalOpen(false);
      setReqSuccessMsg('Solicitação enviada com sucesso para a equipe NexaWeb!');
      if (reqSuccessTimerRef.current) clearTimeout(reqSuccessTimerRef.current);
      reqSuccessTimerRef.current = setTimeout(() => setReqSuccessMsg(null), 3500);
    } catch {
      // tratamento de erro
    } finally {
      setSubmittingReq(false);
    }
  };

  // Determina o índice ativo das etapas NexaWeb
  const currentStageIndex = useMemo(() => {
    if (!project) return 0;
    if (project.status === 'publicado' || project.progresso >= 100) return 5;
    const etapa = (project.etapaAtual || '').toLowerCase();
    if (etapa.includes('publicad')) return 5;
    if (etapa.includes('revis') || etapa.includes('homolog')) return 4;
    if (etapa.includes('desenvolv') || etapa.includes('integraç') || etapa.includes('frontend')) return 3;
    if (etapa.includes('design') || etapa.includes('arte') || etapa.includes('layout')) return 2;
    if (etapa.includes('estrutur') || etapa.includes('wireframe')) return 1;
    if (etapa.includes('briefing') || etapa.includes('alinhament') || etapa.includes('planejament')) return 0;

    // Fallback proporcional ao progresso
    if (project.progresso >= 85) return 4;
    if (project.progresso >= 60) return 3;
    if (project.progresso >= 40) return 2;
    if (project.progresso >= 20) return 1;
    return 0;
  }, [project]);

  // Formata o nome amigável do status do projeto
  const formatProjectStatus = (status: ClientProject['status']) => {
    switch (status) {
      case 'publicado':
        return 'Publicado';
      case 'revisao':
        return 'Em Revisão';
      case 'desenvolvimento':
        return 'Em Desenvolvimento';
      case 'planejamento':
        return 'Em Planejamento';
      case 'em_andamento':
      default:
        return 'Em Andamento';
    }
  };

  // Formata a cor do badge de categoria
  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case 'Briefing':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Ajuste de Design':
        return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
      case 'Troca de Conteúdo':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Dúvida':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Correção':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="space-y-5 pb-28 animate-in fade-in duration-200 overflow-x-hidden">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. FORMULÁRIO DE ACESSO (SE DESLOGADO)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {!project ? (
        <div className="space-y-4">
          <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Área do Cliente NexaWeb</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Acompanhe seu Projeto
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md leading-relaxed">
              Área privada para acompanhar as etapas da NexaWeb, consultar o percentual de evolução, acessar links de homologação e abrir novas solicitações.
            </p>

            <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Chave de Acesso do Projeto
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                    placeholder="Ex: DEMO-2026 ou sua chave"
                    className="min-h-[48px] w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 text-xs sm:text-sm text-white uppercase placeholder:normal-case placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono tracking-wider transition-colors"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="min-h-[48px] w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <span>Conectando...</span>
                ) : (
                  <>
                    <span>Entrar na Área do Cliente</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Acesso rápido para teste */}
            <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Para testar a experiência:</span>
              <button
                type="button"
                onClick={() => setAccessKey('DEMO-2026')}
                className="font-mono text-cyan-400 hover:underline font-semibold"
              >
                Usar DEMO-2026
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            2. ÁREA PRIVADA DO CLIENTE (AUTENTICADO)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        <div className="space-y-4">
          {/* Header do Projeto: Projeto Verificado, Saudação, Empresa, Plano & Status */}
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-md space-y-3.5">
            {/* Linha Superior: Selo Projeto Verificado + Chave + Botão Sair */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Selo: Projeto Verificado */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Projeto Verificado</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 text-slate-400 border border-slate-800 text-[10px] font-mono">
                  <KeyRound className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{project.chaveAcesso}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 sm:px-2.5 sm:py-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs shrink-0"
                title="Sair da Área do Cliente"
                aria-label="Sair da Área do Cliente"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xs:inline text-[11px] font-medium">Sair</span>
              </button>
            </div>

            {/* Saudação do Cliente & Nome da Empresa */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Olá, {project.nomeCliente}!
              </h1>
              <p className="text-sm font-semibold text-cyan-300">
                {project.nomeProjeto}
              </p>
            </div>

            {/* Tags de Identificação: Plano Atual & Status Atual */}
            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
                <Tag className="w-3 h-3 text-indigo-400" />
                <span>Plano {project.planoId.toUpperCase()}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Status: {formatProjectStatus(project.status)}</span>
              </div>
            </div>
          </div>

          {/* Toast de Feedback: Solicitação enviada */}
          {reqSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{reqSuccessMsg}</span>
            </div>
          )}

          {/* Card de Progresso & Etapa Atual */}
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-md space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Etapa Atual
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  {project.etapaAtual}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Concluído
                </span>
                <span className="text-sm font-black font-mono text-cyan-400 bg-cyan-950/90 px-2.5 py-0.5 rounded-lg border border-cyan-800/60 inline-block mt-0.5">
                  {project.progresso}%
                </span>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, project.progresso))}%` }}
              />
            </div>

            {/* Mensagem da Equipe NexaWeb */}
            {project.mensagemStatus && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Mensagem da NexaWeb
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {project.mensagemStatus}
                </p>
              </div>
            )}
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              3. STATUS DO PROJETO — ETAPAS DA NEXAWEB
              Briefing ↓ Estrutura ↓ Design ↓ Desenvolvimento ↓ Revisão ↓ Publicado
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 shadow-md space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Status do Projeto
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Etapa {currentStageIndex + 1} de {NEXAWEB_STAGES.length}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-snug">
              Sequência oficial de desenvolvimento NexaWeb:
            </p>

            {/* Sequência Visual Vertical com Conectores ↓ */}
            <div className="space-y-1 pt-1">
              {NEXAWEB_STAGES.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isPending = idx > currentStageIndex;

                return (
                  <React.Fragment key={stage.id}>
                    <div
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-indigo-950/50 border-cyan-500/50 shadow-sm ring-1 ring-cyan-500/20'
                          : isCompleted
                          ? 'bg-slate-950/50 border-emerald-500/30'
                          : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Indicador visual de estado */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : isCompleted
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border border-slate-700/60'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                          ) : (
                            <span className="text-xs font-mono font-bold text-slate-400">
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Nome da Etapa & Descrição */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs sm:text-sm font-bold truncate ${
                                isCurrent
                                  ? 'text-white'
                                  : isCompleted
                                  ? 'text-slate-200'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                            {stage.desc}
                          </p>
                        </div>
                      </div>

                      {/* Badge de Status da Etapa */}
                      <div className="shrink-0">
                        {isCompleted && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            Concluído
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold animate-pulse">
                            Em Andamento
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 text-[10px] font-medium">
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Seta conectora vertical entre as etapas */}
                    {idx < NEXAWEB_STAGES.length - 1 && (
                      <div className="flex justify-center py-0.5" aria-hidden="true">
                        <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Links Rápidos: Versão de Teste & Site Publicado (dados reais do projeto) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.versaoTesteUrl ? (
              <a
                href={project.versaoTesteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all min-h-[48px] group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors block">
                      Versão de Teste
                    </span>
                    <span className="text-[10px] text-slate-400">Homologação ao vivo</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </a>
            ) : (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/50 opacity-60">
                <Clock className="w-5 h-5 text-slate-500 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Versão de Teste</span>
                  <span className="text-[10px] text-slate-500">Em preparação pela equipe</span>
                </div>
              </div>
            )}

            {project.sitePublicadoUrl ? (
              <a
                href={project.sitePublicadoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all min-h-[48px] group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors block">
                      Site Oficial Publicado
                    </span>
                    <span className="text-[10px] text-slate-400">Acessar produção</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </a>
            ) : (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/50 opacity-60">
                <Clock className="w-5 h-5 text-slate-500 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Site Publicado</span>
                  <span className="text-[10px] text-slate-500">Será liberado na entrega final</span>
                </div>
              </div>
            )}
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              LINHA DO TEMPO DO DESENVOLVIMENTO
              Se não possuir registros: "Nenhuma atualização publicada ainda."
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 shadow-md space-y-3.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Linha do Tempo do Desenvolvimento
              </h3>
            </div>

            {project.historico && project.historico.length > 0 ? (
              <div className="space-y-3 relative pl-4 border-l border-slate-800/80 ml-2 pt-1">
                {project.historico.map((item) => (
                  <div key={item.id} className="relative space-y-1">
                    <div
                      className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                        item.status === 'concluido'
                          ? 'bg-emerald-400 ring-2 ring-emerald-500/30'
                          : 'bg-cyan-400 animate-pulse'
                      }`}
                    />
                    <div className="flex items-center justify-between text-[11px] gap-2">
                      <span className="font-bold text-slate-200">{item.titulo}</span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{item.data}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.descricao}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              /* Estado vazio sem inventar atualizações */
              <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                <Clock className="w-6 h-6 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">
                  Nenhuma atualização publicada ainda.
                </p>
              </div>
            )}
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              4. SEÇÃO: SOLICITAÇÕES E BRIEFING + NOVA SOLICITAÇÃO
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 shadow-md space-y-3.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Solicitações e Briefing
                </h3>
              </div>

              {/* Ação: Nova Solicitação */}
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nova Solicitação</span>
              </button>
            </div>

            {project.solicitacoes && project.solicitacoes.length > 0 ? (
              <div className="space-y-3 pt-1">
                {project.solicitacoes.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2"
                  >
                    {/* Linha da Categoria & Status */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Categoria: Ajuste de Design, Troca de Conteúdo, Dúvida, Correção, Outro, Briefing */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                            req.categoria
                          )}`}
                        >
                          {req.categoria || 'Outro'}
                        </span>
                      </div>

                      {/* Status da Solicitação */}
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          req.status === 'respondido'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : req.status === 'em_analise'
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {req.status === 'respondido'
                          ? 'Respondido'
                          : req.status === 'em_analise'
                          ? 'Em Análise'
                          : 'Pendente'}
                      </span>
                    </div>

                    {/* Assunto da Solicitação */}
                    <h4 className="text-xs font-bold text-white">
                      {req.assunto}
                    </h4>

                    {/* Mensagem detalhada */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {req.mensagem}
                    </p>

                    <span className="text-[10px] text-slate-500 block">
                      Enviado em {req.dataEnvio}
                    </span>

                    {/* Resposta da Equipe NexaWeb (se houver) */}
                    {req.respostaAdmin && (
                      <div className="mt-2.5 p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-indigo-300 font-semibold">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            Resposta da NexaWeb
                          </span>
                          {req.dataResposta && <span>{req.dataResposta}</span>}
                        </div>
                        <p className="text-xs text-indigo-100 leading-relaxed">
                          {req.respostaAdmin}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Estado vazio de solicitações */
              <div className="text-center py-6 text-slate-500 text-xs space-y-2">
                <p>Nenhuma solicitação ou briefing registrado ainda.</p>
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(true)}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  Enviar a primeira solicitação
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MODAL: NOVA SOLICITAÇÃO (CATEGORIAS OFICIAIS)
          - Ajuste de Design
          - Troca de Conteúdo
          - Dúvida
          - Correção
          - Outro
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isRequestModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsRequestModalOpen(false);
          }}
        >
          <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Nova Solicitação</h3>
                <p className="text-[11px] text-slate-400">
                  Envie pedidos para a equipe técnica da NexaWeb
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5">
              {/* Seletor de Categoria */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Categoria da Solicitação
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {REQUEST_CATEGORIES.map((cat) => {
                    const isSelected = reqCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setReqCategory(cat.id)}
                        className={`p-2 rounded-xl text-left border text-xs transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/50'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-sm">{cat.icon}</span>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assunto */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Assunto da Solicitação
                </label>
                <input
                  type="text"
                  required
                  value={reqSubject}
                  onChange={(e) => setReqSubject(e.target.value)}
                  placeholder={
                    reqCategory === 'Ajuste de Design'
                      ? 'Ex: Ajustar cor dos botões, espaçamento...'
                      : reqCategory === 'Troca de Conteúdo'
                      ? 'Ex: Atualizar telefone, endereço ou horários...'
                      : reqCategory === 'Dúvida'
                      ? 'Ex: Dúvida sobre homologação ou domínio...'
                      : reqCategory === 'Correção'
                      ? 'Ex: Link ou imagem com problema na versão de teste...'
                      : 'Ex: Descreva brevemente o assunto...'
                  }
                  className="min-h-[44px] w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Descrição Detalhada */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Descrição Detalhada
                </label>
                <textarea
                  rows={4}
                  required
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                  placeholder="Explique detalhadamente o que você precisa que seja feito no projeto..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Botões de Ação */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingReq || !reqSubject.trim() || !reqMessage.trim()}
                  className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950 transition-all active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReq ? 'Enviando...' : 'Enviar Solicitação'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
