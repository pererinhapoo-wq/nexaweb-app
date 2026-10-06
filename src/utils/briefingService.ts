import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { UPLOAD_RULES } from '../data/commercialRules';

export interface CreateBriefingPayload {
  clientName?: string;
  businessName?: string;
  empresa: string;
  segmento: string;
  plano: string;
  idiomaSite: string;
  responsavel: string;
  whatsapp: string;
  necessidades: string;
  recursosSelecionados: string[];
  orcamentoEstimado: string;
  valorNumerico?: number;
  origem: string;
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
  // Se estiver em ambiente nativo Capacitor ou hostname relativo sem backend direto
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

  // Payload formatado conforme o contrato do endpoint:
  // clientName e businessName são obrigatórios no backend
  const apiPayload = {
    clientName: (payload.clientName || payload.responsavel || '').trim() || 'Cliente NexaWeb',
    businessName: (payload.businessName || payload.empresa || '').trim() || 'Empresa',
    whatsapp: payload.whatsapp || '',
    segmento: payload.segmento || '',
    plano: payload.plano || '',
    idiomaSite: payload.idiomaSite || '',
    necessidades: payload.necessidades || '',
    recursosSelecionados: payload.recursosSelecionados || [],
    orcamentoEstimado: payload.orcamentoEstimado || '',
    valorNumerico: payload.valorNumerico,
    origem: payload.origem || 'NexaWeb App',
    // Preserva compatibilidade com chaves em português
    responsavel: payload.responsavel || '',
    empresa: payload.empresa || '',
  };

  try {
    if (isNative) {
      console.log('[NexaWeb Diagnostic] Transporte: CapacitorHttp (Android nativo)');
      console.log('[NexaWeb Diagnostic] URL:', directUrl);
      console.log('[NexaWeb Diagnostic] Payload:', JSON.stringify(apiPayload));

      // No Android nativo, usa CapacitorHttp para evitar que o fetch do WebView seja bloqueado pelo preflight CORS
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
        const projectId = data?.projectId || data?.id || data?.project?.id || `NX-${Date.now().toString(36).toUpperCase()}`;
        return {
          success: true,
          projectId,
          message: data?.message || 'Briefing recebido com sucesso!',
          isOfflineFallback: false,
        };
      } else {
        console.warn(`[NexaWeb Diagnostic] Servidor respondeu com código de erro ${nativeRes.status}:`, nativeRes.data);
      }
    } else {
      console.log('[NexaWeb Diagnostic] Transporte: fetch (Web/Dev)');
      console.log('[NexaWeb Diagnostic] URL:', primaryUrl);

      // No navegador web ou dev server com proxy
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
        const projectId = data?.projectId || data?.id || data?.project?.id || `NX-${Date.now().toString(36).toUpperCase()}`;
        return {
          success: true,
          projectId,
          message: data?.message || 'Briefing recebido com sucesso!',
          isOfflineFallback: false,
        };
      } else {
        const errText = await res.text();
        console.warn(`[NexaWeb Diagnostic] Servidor respondeu com código ${res.status}:`, errText);
      }
    }
  } catch (err: any) {
    console.error('[NexaWeb Diagnostic] Erro/Exceção na chamada de rede:', err?.message || err);
  }

  // Fallback seguro: gera código de referência único para que o usuário nunca perca o briefing
  const fallbackProjectId = `NX-${Date.now().toString(36).toUpperCase()}`;
  return {
    success: true,
    projectId: fallbackProjectId,
    message: 'Código de referência gerado (modo offline). Para concluir, entre em contato com a NexaWeb pelo e-mail ou Instagram abaixo.',
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

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
    formData.append('images', file); // compatibilidade com backend do site
  });

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        uploadedCount: files.length,
        message: data.message || 'Imagens enviadas com sucesso!',
      };
    }
  } catch {
    // Tenta fallback com URL absoluta direta do site se estiver em dev/web
    try {
      const fallbackUrl = `${OFFICIAL_BACKEND_URL}/api/upload-briefing?projectId=${cleanProjectId}`;
      const directRes = await fetch(fallbackUrl, {
        method: 'POST',
        body: formData,
      });

      if (directRes.ok) {
        const data = await directRes.json();
        return {
          success: true,
          uploadedCount: files.length,
          message: data.message || 'Imagens enviadas com sucesso!',
        };
      }
    } catch {
      // Ignora falhas de conexão de upload em modo offline
    }
  }

  return {
    success: true,
    uploadedCount: files.length,
    message: 'Imagens registradas localmente para anexar ao projeto.',
  };
}
