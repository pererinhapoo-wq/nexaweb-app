import React, { useState, useEffect } from 'react';
import { ClientProject, ClientRequest } from '../types';
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
  PlusCircle,
  X,
  FileText,
  Calendar,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

export const PortalScreen: React.FC = () => {
  const { t } = useTranslation();
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [project, setProject] = useState<ClientProject | null>(null);

  // Modal para nova solicitação
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqSubject, setReqSubject] = useState('');
  const [reqMessage, setReqMessage] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);
  const [reqSuccessMsg, setReqSuccessMsg] = useState<string | null>(null);

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
      const newReq = await submitClientRequest(project.id, reqSubject, reqMessage);
      setProject({
        ...project,
        solicitacoes: [newReq, ...project.solicitacoes],
      });
      setReqSubject('');
      setReqMessage('');
      setIsRequestModalOpen(false);
      setReqSuccessMsg('Solicitação enviada com sucesso para a equipe NexaWeb!');
      setTimeout(() => setReqSuccessMsg(null), 3500);
    } catch {
      // erro
    } finally {
      setSubmittingReq(false);
    }
  };

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
      {/* 1. SE NÃO ESTIVER AUTENTICADO: FORMULÁRIO DE LOGIN */}
      {!project ? (
        <div className="space-y-4">
          <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Área do Cliente NexaWeb</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Acompanhe seu Projeto
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md leading-relaxed">
              Consulte o progresso do desenvolvimento, acesse links de homologação e envie solicitações diretamente para a equipe técnica.
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
                    className="min-h-[46px] w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 text-xs sm:text-sm text-white uppercase placeholder:normal-case placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono tracking-wider"
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
                className="min-h-[48px] w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <span>Conectando...</span>
                ) : (
                  <>
                    <span>Entrar no Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Dica para teste rápido */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
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
        /* 2. PROJETO AUTENTICADO */
        <div className="space-y-4">
          {/* Header do Projeto */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 shadow-md flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-semibold mb-1.5">
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>Chave: {project.chaveAcesso}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {project.nomeProjeto}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Cliente: <span className="text-slate-200 font-semibold">{project.nomeCliente}</span> · Plano <span className="capitalize text-indigo-400 font-semibold">{project.planoId}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs shrink-0"
              title="Sair da Área do Cliente"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xs:inline">Sair</span>
            </button>
          </div>

          {/* Feedback de solicitação enviada */}
          {reqSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{reqSuccessMsg}</span>
            </div>
          )}

          {/* Card de Progresso e Etapa Atual */}
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
              <span className="text-xs font-black font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/60">
                {project.progresso}%
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${project.progresso}%` }}
              />
            </div>

            {/* Mensagem da Equipe */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                Mensagem da NexaWeb
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.mensagemStatus}
              </p>
            </div>
          </div>

          {/* Links Rápidos: Versão de Teste & Site Publicado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.versaoTesteUrl ? (
              <a
                href={project.versaoTesteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all min-h-[48px] group"
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
                <Clock className="w-5 h-5 text-slate-500" />
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
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all min-h-[48px] group"
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
                <Clock className="w-5 h-5 text-slate-500" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Site Publicado</span>
                  <span className="text-[10px] text-slate-500">Será liberado na entrega final</span>
                </div>
              </div>
            )}
          </div>

          {/* Seção de Solicitações do Cliente & Respostas do Admin */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 shadow-md space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Solicitações & Ajustes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nova Solicitação</span>
              </button>
            </div>

            {project.solicitacoes && project.solicitacoes.length > 0 ? (
              <div className="space-y-3">
                {project.solicitacoes.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{req.assunto}</h4>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          req.status === 'respondido'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {req.status === 'respondido' ? 'Respondido' : 'Pendente'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {req.mensagem}
                    </p>
                    <span className="text-[10px] text-slate-500 block">Enviado em {req.dataEnvio}</span>

                    {/* Resposta do Admin com destaque visual */}
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
              <div className="text-center py-6 text-slate-500 text-xs space-y-2">
                <p>Nenhuma solicitação aberta para este projeto.</p>
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

          {/* Histórico de Atualizações */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Linha do Tempo do Projeto
              </h3>
            </div>

            <div className="space-y-3 relative pl-4 border-l border-slate-800/80 ml-2">
              {project.historico.map((item) => (
                <div key={item.id} className="relative space-y-1">
                  <div
                    className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                      item.status === 'concluido'
                        ? 'bg-emerald-400 ring-2 ring-emerald-500/30'
                        : 'bg-cyan-400 animate-pulse'
                    }`}
                  />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200">{item.titulo}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.data}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVA SOLICITAÇÃO DO CLIENTE */}
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
              <h3 className="text-sm font-bold text-white">Nova Solicitação / Dúvida</h3>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Assunto da Solicitação
                </label>
                <input
                  type="text"
                  required
                  value={reqSubject}
                  onChange={(e) => setReqSubject(e.target.value)}
                  placeholder="Ex: Troca de imagem, horário, texto..."
                  className="min-h-[44px] w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Descrição Detalhada
                </label>
                <textarea
                  rows={4}
                  required
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                  placeholder="Descreva o que deseja ajustar ou a dúvida sobre seu projeto..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

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
                  disabled={submittingReq}
                  className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReq ? 'Enviando...' : 'Enviar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
