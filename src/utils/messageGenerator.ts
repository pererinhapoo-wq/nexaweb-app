export interface MessageVariables {
  nomeEmpresa: string;
  segmento: string;
  cidade: string;
}

export function generateApproachMessage({
  nomeEmpresa,
  segmento,
  cidade,
}: MessageVariables): string {
  const empresaFormatada = nomeEmpresa ? nomeEmpresa.trim() : 'sua empresa';
  const segmentoFormatado = segmento ? segmento.toLowerCase().trim() : 'seu segmento';
  const cidadeFormatada = cidade ? cidade.trim() : '';

  const locTexto = cidadeFormatada ? ` aí em ${cidadeFormatada}` : '';

  return `Olá! Tudo bem? Me chamo da equipe NexaWeb.

Estava analisando algumas referências de empresas do ramo de ${segmentoFormatado}${locTexto} e encontrei o perfil da *${empresaFormatada}*.

Nós desenvolvemos sites e páginas de alta conversão pensados para transformar visitantes em clientes no WhatsApp todos os dias.

Preparei uma breve apresentação e alguns modelos de demonstração que criamos especificamente para o segmento de ${segmentoFormatado}. 

Teria 2 minutos para dar uma olhada e ver como podemos impulsionar os resultados digitais da ${empresaFormatada}?`;
}

export function cleanWhatsAppNumber(numberStr?: string): string {
  if (!numberStr) return '';
  const digits = numberStr.replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}
