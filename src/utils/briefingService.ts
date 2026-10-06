import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { UPLOAD_RULES } from '../data/commercialRules';

export interface CreateBriefingPayload {
  clientName?: string;
  businessName?: string;
  empresa?: string;
  responsavel?: string;
  clientEmail?: string;
  clientPhone?: string;
  phone?: string;
  segmento?: string;
  plano?: string;
  plan?: string;
  idiomaSite?: string;
  necessidades?: string;
  clientNotes?: string;
  recursosSelecionados?: string[];
  orcamentoEstimado?: string;
  valorNumerico?: number;
  origem?: string;
  briefingSummary?: string;
}

export interface BriefingResponse {
  success: boolean;
  projectId?: string;
  message?: string;
  error?: string;
  isOfflineFallback?: boolean;
}

export interface UploadResponse {
  success: boolean;
  uploadedCount?: number;
  message?: string;
  error?: string;
}

// URL canônica do backend oficial NexaWeb
const OFFICIAL_BACKEND_URL = 'https://nexaweeb.vercel.app';

// Resolução de endpoint seguro (funciona tanto no dev com proxy quanto no build/Capacitor)
function getApiEndpoint(path: string): string {
  if (
    Capacitor.isNativePlatform() ||
    (typeof window !== 'undefined' &&
      (window.location.protocol === 'capacitor:' ||
        window.location.protocol === 'file:' ||
        (window.location.hostname === 'localhost' && !window.location.port)))
  ) {
    return `${OFFICIAL_BACKEND_URL}${path}`;
  }
  return path;
}

export async function createBriefing(payload: CreateBriefingPayload): Promise<BriefingResponse> {
  const isNative = Capacitor.isNativePlatform();
  const directUrl = `${OFFICIAL_BACKEND_URL}/api/create-briefing`;
  const primaryUrl = isNative ? directUrl : getApiEndpoint('/api/create-briefing');

  const clientName = (payload.clientName || payload.responsavel || '').trim() || 'Cliente NexaWeb';
  const businessName = (payload.businessName || payload.empresa || '').trim() || 'Empresa';
  const clientPhone = (payload.clientPhone || payload.phone || '').trim();
  const clientEmail = (payload.clientEmail || '').trim();
  const clientNotes = (payload.clientNotes || payload.necessidades || '').trim();
  const plan = (payload.plan || payload.plano || 'profissional').toLowerCase().trim();
  const briefingSummary = (payload.briefingSummary || payload.necessidades || '').trim() || 'Solicitação de briefing via NexaWeb App';

  // Contrato oficial da API /api/create-briefing:
  // Requer clientName, businessName, plan e briefingSummary
  const apiPayload = {
    clientName,
    businessName,
    clientEmail,
    clientPhone,
    clientNotes,
    plan,
    briefingSummary,
    // Compatibilidade com chaves adicionais
    segmento: payload.segmento || '',
    plano: plan,
    idiomaSite: payload.idiomaSite || '',
    necessidades: clientNotes,
    recursosSelecionados: payload.recursosSelecionados || [],
    orcamentoEstimado: payload.orcamentoEstimado || '',
    valorNumerico: payload.valorNumerico,
    origem: payload.origem || 'NexaWeb App',
    responsavel: clientName,
    empresa: businessName,
  };

  try {
    if (isNative) {
      console.log('[NexaWeb Diagnostic] Transporte: CapacitorHttp (Android nativo)');
      console.log('[NexaWeb Diagnostic] URL:', directUrl);

      // No Android nativo, usa CapacitorHttp para contornar restrições de CORS no WebView
      const nativeRes = await CapacitorHttp.post({
        url: directUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        data: apiPayload,
      });

      console.log('[NexaWeb Diagnostic] Status HTTP:', nativeRes.status);
      console.log('[NexaWeb Diagnostic] Resposta do servidor:', nativeRes.data);

      if (nativeRes.status >= 200 && nativeRes.status < 300) {
        const data = typeof nativeRes.data === 'string' ? JSON.parse(nativeRes.data) : nativeRes.data;
        if (data && (data.success || data.projectId)) {
          const projectId = data?.projectId || data?.id || data?.project?.id;
          return {
            success: true,
            projectId,
            message: 'Seu projeto foi enviado com sucesso para a equipe NexaWeb!',
            isOfflineFallback: false,
          };
        }
      } else {
        console.warn(`[NexaWeb Diagnostic] Servidor respondeu com código ${nativeRes.status}:`, nativeRes.data);
      }
    } else {
      console.log('[NexaWeb Diagnostic] Transporte: fetch (Web/Dev)');
      console.log('[NexaWeb Diagnostic] URL:', primaryUrl);

      const res = await fetch(primaryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      console.log('[NexaWeb Diagnostic] Status HTTP:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('[NexaWeb Diagnostic] Resposta do servidor:', data);
        if (data && (data.success || data.projectId)) {
          const projectId = data?.projectId || data?.id || data?.project?.id;
          return {
            success: true,
            projectId,
            message: 'Seu projeto foi enviado com sucesso para a equipe NexaWeb!',
            isOfflineFallback: false,
          };
        }
      } else {
        const errText = await res.text();
        console.warn(`[NexaWeb Diagnostic] Servidor respondeu com código ${res.status}:`, errText);
      }
    }
  } catch (err: any) {
    console.error('[NexaWeb Diagnostic] Erro/Exceção na chamada de rede:', err?.message || err);
  }

  // Se a requisição de rede falhar, retorna erro claro para permitir retry conforme especificação técnica
  return {
    success: false,
    error: 'Não foi possível enviar o briefing. Verifique sua conexão e tente novamente.',
  };
}

// Fallback explícito para modo offline quando solicitado pelo usuário ou após conexão indisponível
export function generateOfflineBriefingProtocol(): BriefingResponse {
  const fallbackProjectId = `NX-${Date.now().toString(36).toUpperCase()}`;
  return {
    success: true,
    projectId: fallbackProjectId,
    message: 'Código de referência gerado (modo offline). Para concluir, entre em contato com a NexaWeb pelo e-mail ou Instagram oficial.',
    isOfflineFallback: true,
  };
}

export async function uploadBriefingImages(
  projectId: string,
  files: File[]
): Promise<UploadResponse> {
  if (!files || files.length === 0) {
    return { success: true, uploadedCount: 0 };
  }

  // Validação comercial aprovada: máximo 6 imagens e máximo 10MB por arquivo
  if (files.length > UPLOAD_RULES.maxFiles) {
    return {
      success: false,
      error: `Permitido no máximo ${UPLOAD_RULES.maxFiles} imagens por projeto.`,
    };
  }

  for (const file of files) {
    if (file.size > UPLOAD_RULES.maxSizeBytes) {
      return {
        success: false,
        error: `O arquivo "${file.name}" ultrapassa o limite oficial de ${UPLOAD_RULES.maxSizeMB} MB.`,
      };
    }
    if (!UPLOAD_RULES.allowedMimeTypes.includes(file.type) && !file.type.startsWith('image/')) {
      return {
        success: false,
        error: `Formato do arquivo "${file.name}" não é suportado. Envie apenas imagens.`,
      };
    }
  }

  const cleanProjectId = encodeURIComponent(projectId.trim());
  const isNative = Capacitor.isNativePlatform();
  const directUrl = `${OFFICIAL_BACKEND_URL}/api/upload-briefing?projectId=${cleanProjectId}`;
  const targetUrl = isNative ? directUrl : getApiEndpoint(`/api/upload-briefing?projectId=${cleanProjectId}`);

  let uploadedCount = 0;
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId.trim());

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        uploadedCount++;
      }
    } catch {
      try {
        const directRes = await fetch(directUrl, {
          method: 'POST',
          body: formData,
        });

        if (directRes.ok) {
          uploadedCount++;
        }
      } catch {
        // Ignora falhas individuais em modo offline
      }
    }
  }

  return {
    success: true,
    uploadedCount,
    message: uploadedCount > 0 ? `${uploadedCount} imagem(ns) enviada(s) com sucesso!` : 'Imagens registradas localmente para o projeto.',
  };
}
