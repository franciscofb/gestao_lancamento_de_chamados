export interface Ticket {
  id: string; // unique ID
  pessoaEmail: string; // email with autocomplete domains
  requireSystem: string; // system requested
  role: string; // designated role
  equipe: string; // assigned team
  url: string; // external link/reference URL
  status: TicketStatus; // status of request
  employeeId: string; // ID of the requester/employee
  dataAbertura: string; // opening date (YYYY-MM-DD or full ISO string)
  prioridade: TicketPriority; // priority (baixa, normal, alta)
  dataInclusao: string; // exact submission timestamp (YYYY-MM-DD HH:mm:ss)
  
  // Custom metadata fields cloned from Jira Portal group/3052/create/7022 (Form 2.0)
  resumo?: string;
  managerEmail?: string;
  justificativa?: string;
  zona?: string;
  anexoNome?: string;
}

export type TicketPriority = 'baixa' | 'normal' | 'alta';

export type TicketStatus = 'Aberto' | 'Em Atendimento' | 'Concluído' | 'Cancelado' | 'Não Solicitado' | 'Fechada' | 'Fechado';

export const REQUIRE_SYSTEMS = [
  'Azure AD (BEES Tenant)',
  'Confluence Guest',
  'Azure DevOps',
  'AD Group - Unity Catalog'
];

export const ROLES = [
  'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
  'AADS_A_BEES_CONSUMER_MARKETING_AMERICA',
  'AADS_A_BEES_UC_CONSUMER_MARKETING_ENGINEER',
  'AADS_A_BEES_UC_CONSUMER_MARKETING_ADMIN',
  'Confluence Guest (Martech Data & Measurement pages)',
  'Confluence  Guest(Martech Data & Measurement pages)',
  'Confluence  Guest(Martech Data & Measurement)',
  'Confluence (Martech and Martech Data & Measurement pages)',
  'Sem Função / Acesso Básico',
  'Vazio'
];

export const EQUIPES = [
  'BPCS',
  'BrewDat',
  'Databricks',
  'Martech'
];

export const PRIORITIES: TicketPriority[] = ['baixa', 'normal', 'alta'];

export const STATUS_OPTIONS: TicketStatus[] = ['Aberto', 'Em Atendimento', 'Concluído', 'Cancelado', 'Não Solicitado', 'Fechada', 'Fechado'];

export const EMAIL_DOMAINS = [
  '@ab-inbev.com',
  '@labatt.com',
  '@anheuser-busch.com'
];
