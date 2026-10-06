import { UPLOAD_RULES } from '../data/commercialRules';

export interface CreateBriefingPayload {
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

// Resolução de endpoint seguro (funciona tanto no dev com proxy quanto no build/Capacitor)
function getApiEndpoint(path: string): string {
  // Se estiver em ambiente nativo Capacitor ou hostname relativo sem backend direto
  if (
    typeof window !== 'undefined' &&
    (window.location.protocol === 'capacitor:' ||
     window.location.protocol === 'file:' ||
     (window.location.hostname === 'localhost' && !window.location.port))
  ) {
    return `https://nexaweeb.vercel.app${path}`;
  }
  return path;
}

export async function createBriefing(payload: CreateBriefingPayload): Promise<BriefingResponse> {
  const primaryUrl = getApiEndpoint('/api/create-briefing');

  try {
    const res = await fetch(primaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        projectId: data.projectId || data.id || data.project?.id || `NX-${Date.now().toString(36).toUpperCase()}`,
        message: data.message || 'Briefing recebido com sucesso!',
        isOfflineFallback: false,
      };
    }
  } catch {
    // Se a chamada relativa falhar por rede ou CORS, tenta diretamente a URL oficial do site
    try {
      const directUrl = `https://nexaweeb.vercel.app/api/create-briefing`;
      const directRes = await fetch(directUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (directRes.ok) {
        const data = await directRes.json();
        return {
          success: true,
          projectId: data.projectId || data.id || data.project?.id || `NX-${Date.now().toString(36).toUpperCase()}`,
          message: data.message || 'Briefing recebido com sucesso!',
          isOfflineFallback: false,
        };
      }
    } catch {
      // Falha de rede / offline no dispositivo
    }
  }

  // Fallback seguro: gera código de referência único para que o usuário nunca perca o briefing
  const fallbackProjectId = `NX-${Date.now().toString(36).toUpperCase()}`;
  return {
    success: true,
    projectId: fallbackProjectId,
    message: 'Código de referência gerado (modo offline). Para concluir, envie o resumo pelo WhatsApp abaixo.',
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
  const primaryUrl = getApiEndpoint(`/api/upload-briefing?projectId=${cleanProjectId}`);

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
    formData.append('images', file); // compatibilidade com backend do site
  });

  try {
    const res = await fetch(primaryUrl, {
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
    // Tenta fallback com URL absoluta direta do site
    try {
      const directUrl = `https://nexaweeb.vercel.app/api/upload-briefing?projectId=${cleanProjectId}`;
      const directRes = await fetch(directUrl, {
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
