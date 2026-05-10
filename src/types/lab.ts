// src/types/lab.ts

export type LabDeploymentStatus = 
  | 'pending' 
  | 'building' 
  | 'live' 
  | 'failed' 
  | 'deactivated'

export type LabNiche = 
  | 'restaurante' 
  | 'clinica' 
  | 'salao_beleza' 
  | 'barbearia' 
  | 'academia'
  | 'oficina' 
  | 'farmacia' 
  | 'padaria' 
  | 'loja' 
  | 'outro'

export const NICHE_LABELS: Record<LabNiche, string> = {
  restaurante:   'Restaurante',
  clinica:       'Clínica',
  salao_beleza:  'Salão de Beleza',
  barbearia:     'Barbearia',
  academia:      'Academia',
  oficina:       'Oficina / Mecânica',
  farmacia:      'Farmácia',
  padaria:       'Padaria',
  loja:          'Loja',
  outro:         'Outro',
}

export const STATUS_CONFIG: Record<LabDeploymentStatus, { label: string; color: string; bg: string }> = {
  pending:     { label: 'Aguardando',  color: 'text-gray-600',    bg: 'bg-gray-100' },
  building:    { label: 'Gerando',     color: 'text-blue-600',    bg: 'bg-blue-50' },
  live:        { label: 'No Ar',       color: 'text-emerald-600', bg: 'bg-emerald-50' },
  failed:      { label: 'Falhou',      color: 'text-red-600',     bg: 'bg-red-50' },
  deactivated: { label: 'Desativado',  color: 'text-gray-400',    bg: 'bg-gray-50' },
}

export const ALL_FEATURES = [
  { key: 'whatsapp_button',  label: 'Botão WhatsApp',         description: 'CTA flutuante de WhatsApp' },
  { key: 'google_maps',      label: 'Google Maps',             description: 'Embed do mapa com localização' },
  { key: 'gallery',          label: 'Galeria de Fotos',        description: 'Seção de galeria de imagens' },
  { key: 'menu_list',        label: 'Cardápio / Serviços',     description: 'Lista de itens tokenizada' },
  { key: 'booking_form',     label: 'Formulário de Reserva',   description: 'Agendamento online básico' },
  { key: 'carousel',         label: 'Carrossel de Imagens',    description: 'Hero com carrossel automático' },
  { key: 'seo_schema',       label: 'SEO Schema Local',        description: 'JSON-LD para Google Maps' },
  { key: 'instagram_feed',   label: 'Feed do Instagram',       description: 'Últimas postagens do IG' },
] as const

export type FeatureKey = typeof ALL_FEATURES[number]['key']

export interface LabTemplate {
  id: string
  created_at: string
  name: string
  niche: LabNiche
  description: string | null
  github_template_repo: string
  thumbnail_url: string | null
  preview_demo_url: string | null
  is_active: boolean
  default_features: Record<string, boolean>
  default_tokens: Record<string, string>
}

export interface LabPreview {
  id: string
  created_at: string
  updated_at: string
  template_id: string
  lead_id: string | null
  workspace_id: string | null
  slug: string
  company_name: string
  niche: LabNiche
  config_json: Record<string, unknown>
  features: Record<string, boolean>
  github_repo: string | null
  preview_url: string | null
  github_run_id: string | null
  status: LabDeploymentStatus
  modo_previa: boolean
  error_log: string | null
  generated_by: string | null
  activated_at: string | null
  preview_views: number
  // joins
  lab_templates?: { name: string; niche: LabNiche }
}

export interface ConfigJson {
  // Identidade
  nomeEmpresa: string
  slogan?: string
  descricao?: string
  // Cores e visual
  corPrimaria: string
  corSecundaria: string
  fonteTitulo: string
  fonteCopo: string
  linkLogo?: string
  galeriaFotos?: string[]
  // Contato
  telefone?: string
  numeroWhatsApp?: string
  email?: string
  endereco?: string
  urlMaps?: string
  // Redes sociais
  instagram?: string
  facebook?: string
  // Horários
  horarios?: Record<string, string>
  // Cardápio / Serviços
  itensCardapio?: Array<{
    nome: string
    descricao?: string
    preco?: string
    imagem?: string
  }>
  // Sistema
  modoPrevia: boolean
  features: Record<string, boolean>
}