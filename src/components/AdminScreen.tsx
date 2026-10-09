import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ClientProject, ClientRequest } from '../types';
import {
  getAllProjects,
  updateProjectByAdmin,
  replyToClientRequest,
  loginAdmin,
  isAdminAuthenticated,
  logoutAdmin,
} from '../utils/portalService';
import {
  Shield,
  Lock,
  LogOut,
  FolderKanban,
  MessageSquare,
  Sparkles,
  Edit3,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Save,
  X,
  Send,
  Sliders,
} from 'lucide-react';
import { BackButton } from './BackButton';
import { useTranslation } from '../contexts/LanguageContext';

interface AdminScreenProps {
  onBack?: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [activeTab, setActiveTab] = useState<'projetos' | 'solicitacoes'>('projetos');

  // Modal para editar projeto
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
  const [editStage, setEditStage] = useState('');
  const [editProgress, setEditProgress] = useState(50);
  const [editStatus, setEditStatus] = useState<ClientProject['status']>('em_andamento');
  const [editMessage, setEditMessage] = useState('');
  const [editStagingUrl, setEditStagingUrl] = useState('');
  const [editProdUrl, setEditProdUrl] = useState('');

  // Modal para responder solicitação
  const [replyingRequest, setReplyingRequest] = useState<{
    projectId: string;
    request: ClientRequest;
  } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // Lock de scroll e tecla Escape para os modais de administração
  useEffect(() => {
    const isAnyModalOpen = Boolean(editingProject || replyingRequest);
    if (!isAnyModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingProject(null);
        setReplyingRequest(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingProject, replyingRequest]);

  useEffect(() => {
    async function checkAuth() {
      const auth = await isAdminAuthenticated();
      if (auth) {
        setIsAdmin(true);
        loadProjects();
      }
    }
    checkAuth();
  }, []);

  const loadProjects = async () => {
    const list = await getAllProjects();
    setProjects(list);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await loginAdmin(password);
    if (ok) {
      setIsAdmin(true);
      setErrorMsg(null);
      await loadProjects();
    } else {
      setErrorMsg(t.admin.invalidPassword);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAdmin(false);
    setPassword('');
  };

  const openEditModal = (proj: ClientProject) => {
    setEditingProject(proj);
    setEditStage(proj.etapaAtual);
    setEditProgress(proj.progresso);
    setEditStatus(proj.status);
    setEditMessage(proj.mensagemStatus);
    setEditStagingUrl(proj.versaoTesteUrl || '');
    setEditProdUrl(proj.sitePublicadoUrl || '');
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    await updateProjectByAdmin(editingProject.id, {
      etapaAtual: editStage,
      progresso: editProgress,
      status: editStatus,
      mensagemStatus: editMessage,
      versaoTesteUrl: editStagingUrl,
      sitePublicadoUrl: editProdUrl,
    });

    await loadProjects();
    setEditingProject(null);
    setFeedbackMsg(t.admin.projectUpdated);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const openReplyModal = (projectId: string, req: ClientRequest) => {
    setReplyingRequest({ projectId, request: req });
    setReplyText(req.respostaAdmin || '');
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingRequest || !replyText.trim()) return;

    await replyToClientRequest(
      replyingRequest.projectId,
      replyingRequest.request.id,
      replyText
    );

    await loadProjects();
    setReplyingRequest(null);
    setReplyText('');
    setFeedbackMsg(t.admin.replySent);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Coleta todas as solicitações para a visão de lista do Admin (memoizado para evitar re-computações)
  const allRequests = useMemo(() => {
    const list: { projectId: string; projectName: string; clientName: string; req: ClientRequest }[] = [];
    projects.forEach((p) => {
      if (p.solicitacoes) {
        p.solicitacoes.forEach((r) => {
          list.push({
            projectId: p.id,
            projectName: p.nomeProjeto,
            clientName: p.nomeCliente,
            req: r,
          });
        });
      }
    });
    return list;
  }, [projects]);

  return (
    <div className="space-y-5 pb-6 animate-in fade-in duration-200 overflow-x-hidden">
      {/* 1. SE NÃO FOR AUTENTICADO COMO ADMIN */}
      {!isAdmin ? (
        <div className="space-y-4">
          <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.admin.badge}</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t.admin.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md leading-relaxed">
              {t.admin.desc}
            </p>

            <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {t.admin.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.admin.passwordPlaceholder}
                    className="min-h-[46px] w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="min-h-[48px] w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>{t.admin.loginBtn}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{t.admin.testPasswordNotice}</span>
              <button
                type="button"
                onClick={() => setPassword('admin2026')}
                className="font-mono text-amber-400 hover:underline font-semibold"
              >
                admin2026
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. PAINEL ADMIN LOGADO */
        <div className="space-y-4">
          {/* Header do Admin */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Gestão NexaWeb
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Online
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  {projects.length} projetos cadastrados · {allRequests.length} solicitações
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs shrink-0"
              title={t.portal.logout}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xs:inline">{t.portal.logout}</span>
            </button>
          </div>

          {feedbackMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Abas do Admin: Projetos / Solicitações */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('projetos')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'projetos'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>{t.admin.projectsTab} ({projects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('solicitacoes')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'solicitacoes'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.admin.requestsTab} ({allRequests.length})</span>
            </button>
          </div>

          {/* ABA 1: PROJETOS (FORMATO CARDS RESPONSIVOS PARA MOBILE) */}
          {activeTab === 'projetos' && (
            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl p-4 bg-slate-900 border border-slate-800 shadow-md space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {proj.chaveAcesso}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {proj.planoId}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{proj.nomeProjeto}</h3>
                      <p className="text-xs text-slate-400">{t.portal.clientName}: {proj.nomeCliente}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEditModal(proj)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-400 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t.admin.editProject}</span>
                    </button>
                  </div>

                  {/* Progresso & Etapa */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{proj.etapaAtual}</span>
                      <span className="font-mono font-bold text-cyan-400">{proj.progresso}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full"
                        style={{ width: `${proj.progresso}%` }}
                      />
                    </div>
                  </div>

                  {/* Mensagem atual ao cliente */}
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                      {t.admin.statusMessage}:
                    </span>
                    {proj.mensagemStatus}
                  </div>

                  {/* Links de Teste & Produção */}
                  <div className="flex items-center gap-2 pt-1">
                    {proj.versaoTesteUrl && (
                      <a
                        href={proj.versaoTesteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-400 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{t.admin.stagingUrl}</span>
                      </a>
                    )}
                    {proj.sitePublicadoUrl && (
                      <a
                        href={proj.sitePublicadoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{t.admin.prodUrl}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ABA 2: SOLICITAÇÕES DOS CLIENTES (COM INTERFACE PARA RESPONDER) */}
          {activeTab === 'solicitacoes' && (
            <div className="space-y-3.5">
              {allRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  {t.admin.noRequestsYet}
                </div>
              ) : (
                allRequests.map(({ projectId, projectName, clientName, req }) => (
                  <div
                    key={req.id}
                    className="rounded-2xl p-4 bg-slate-900 border border-slate-800 shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {req.categoria && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {req.categoria}
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              req.status === 'respondido'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {req.status === 'respondido' ? t.portal.requestStatusAnswered : t.portal.requestStatusPending}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{req.dataEnvio}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white">{req.assunto}</h3>
                        <p className="text-xs text-slate-400">
                          {clientName} · <span className="text-slate-300">{projectName}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => openReplyModal(projectId, req)}
                        className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{req.respostaAdmin ? t.admin.editReply : t.admin.replyRequest}</span>
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="text-[10px] font-semibold text-slate-500 block uppercase mb-0.5">
                        {t.admin.clientMessage}
                      </span>
                      {req.mensagem}
                    </div>

                    {req.respostaAdmin && (
                      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-cyan-300 font-semibold">
                          <span>{t.admin.yourCurrentResponse}</span>
                          {req.dataResposta && <span>{req.dataResposta}</span>}
                        </div>
                        <p>{req.respostaAdmin}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL: EDITAR PROJETO (ADMIN) */}
      {editingProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingProject(null);
          }}
        >
          <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 space-y-4 max-h-[85dvh] sm:max-h-[90vh] overflow-y-auto no-scrollbar safe-area-pb animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            {/* Mobile drag handle discreto */}
            <div className="pt-0.5 pb-1 flex justify-center sm:hidden shrink-0" aria-hidden="true">
              <div className="w-10 h-1 bg-slate-700/80 rounded-full" />
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{t.admin.editProjectTitle}</h3>
                <p className="text-[11px] text-slate-400">{editingProject.nomeProjeto}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors -mr-1 active:scale-95"
                aria-label={t.portfolio.close}
                title={t.portfolio.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.admin.currentStage}
                </label>
                <input
                  type="text"
                  required
                  value={editStage}
                  onChange={(e) => setEditStage(e.target.value)}
                  className="min-h-[42px] w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>{t.admin.progress}:</span>
                  <span className="font-mono text-cyan-400">{editProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.admin.statusMessage}
                </label>
                <textarea
                  rows={3}
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    {t.admin.stagingUrl}
                  </label>
                  <input
                    type="url"
                    value={editStagingUrl}
                    onChange={(e) => setEditStagingUrl(e.target.value)}
                    placeholder="https://preview.exemplo.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    {t.admin.prodUrl}
                  </label>
                  <input
                    type="url"
                    value={editProdUrl}
                    onChange={(e) => setEditProdUrl(e.target.value)}
                    placeholder="https://exemplo.com.br"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  {t.admin.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-950"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.admin.saveBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESPONDER SOLICITAÇÃO (ADMIN) */}
      {replyingRequest && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReplyingRequest(null);
          }}
        >
          <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 space-y-4 max-h-[85dvh] sm:max-h-[90vh] overflow-y-auto no-scrollbar safe-area-pb animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            {/* Mobile drag handle discreto */}
            <div className="pt-0.5 pb-1 flex justify-center sm:hidden shrink-0" aria-hidden="true">
              <div className="w-10 h-1 bg-slate-700/80 rounded-full" />
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{t.admin.replyRequest}</h3>
                <p className="text-[11px] text-slate-400">{replyingRequest.request.assunto}</p>
              </div>
              <button
                type="button"
                onClick={() => setReplyingRequest(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors -mr-1 active:scale-95"
                aria-label={t.portfolio.close}
                title={t.portfolio.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold mb-0.5">
                {t.admin.clientMessage}
              </span>
              <p className="italic">"{replyingRequest.request.mensagem}"</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.admin.replyTitle}
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t.admin.replyPlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setReplyingRequest(null)}
                  className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  {t.admin.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-950"
                >
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>{t.admin.sendReplyBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
