import React, { useState, useEffect, useRef } from 'react';
import { Ticket, TicketPriority, TicketStatus, REQUIRE_SYSTEMS, ROLES, EQUIPES, PRIORITIES, STATUS_OPTIONS, EMAIL_DOMAINS } from '../types';
import { Calendar, User, Shield, HelpCircle, Users, Link, Key, Clock, AlertTriangle, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';

interface TicketFormProps {
  onSave: (ticket: Partial<Ticket> | Partial<Ticket>[]) => void;
  ticketToEdit?: Ticket | null;
  onCancelEdit?: () => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info', title?: string) => void;
}

export default function TicketForm({ onSave, ticketToEdit, onCancelEdit, showToast }: TicketFormProps) {
  // Input states
  const [pessoaEmail, setPessoaEmail] = useState('');
  const [requireSystem, setRequireSystem] = useState('');
  const [role, setRole] = useState('');
  const [equipe, setEquipe] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<TicketStatus>('Aberto');
  const [employeeId, setEmployeeId] = useState('');
  const [dataAbertura, setDataAbertura] = useState('');
  const [prioridade, setPrioridade] = useState<TicketPriority>('normal');
  const [acessoFull, setAcessoFull] = useState(false);

  // UI state
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Pre-fill fields if editing a ticket
  useEffect(() => {
    if (ticketToEdit) {
      setPessoaEmail(ticketToEdit.pessoaEmail);
      setRequireSystem(ticketToEdit.requireSystem);
      setRole(ticketToEdit.role);
      setEquipe(ticketToEdit.equipe);
      setUrl(ticketToEdit.url);
      setStatus(ticketToEdit.status);
      setEmployeeId(ticketToEdit.employeeId);
      setDataAbertura(ticketToEdit.dataAbertura);
      setPrioridade(ticketToEdit.prioridade);
      setAcessoFull(false);
      setErrorMsg('');
      setSuccessMsg('');
    } else {
      // Set default opening date to today
      const today = new Date().toISOString().split('T')[0];
      setDataAbertura(today);
      resetForm();
    }
  }, [ticketToEdit]);

  // Handle outside click to hide suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetForm = () => {
    setPessoaEmail('');
    setRequireSystem('');
    setRole('');
    setEquipe('');
    setUrl('');
    setStatus('Aberto');
    setEmployeeId('');
    const today = new Date().toISOString().split('T')[0];
    setDataAbertura(today);
    setPrioridade('normal');
    setAcessoFull(false);
    setErrorMsg('');
  };

  // Autocomplete Logic
  const handleEmailChange = (val: string) => {
    setPessoaEmail(val);
    
    if (!val || val.includes('@')) {
      setEmailSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clean input and make suggestions based on current typed prefix
    const prefix = val.trim();
    if (prefix.length > 0) {
      const suggestions = EMAIL_DOMAINS.map(domain => `${prefix}${domain}`);
      setEmailSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setEmailSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectEmailSuggestion = (email: string) => {
    setPessoaEmail(email);
    setShowSuggestions(false);
  };

  // Date toolbox quick-setters
  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    const dateStr = d.toISOString().split('T')[0];
    setDataAbertura(dateStr);
  };

  // Form Submission handles validation and bubbles up to App.tsx
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations:
    if (!pessoaEmail.trim()) {
      const msg = 'O campo Pessoa (E-mail) é obrigatório.';
      setErrorMsg(msg);
      if (showToast) showToast(msg, 'error', 'CAMPO OBRIGATÓRIO');
      return;
    }

    // Basic email format check
    const emailLower = pessoaEmail.trim();
    if (emailLower && !emailLower.includes('@')) {
      const msg = 'Insira um endereço de e-mail válido.';
      setErrorMsg(msg);
      if (showToast) showToast(msg, 'error', 'FORMATO DE E-MAIL');
      return;
    }

    if (!dataAbertura) {
      const msg = 'A Data de Abertura é obrigatória.';
      setErrorMsg(msg);
      if (showToast) showToast(msg, 'error', 'CAMPO OBRIGATÓRIO');
      return;
    }

    // Capture exact Timestamp for "Data de inclusão"
    const now = new Date();
    const formattedInclusionDate = now.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    if (acessoFull && !ticketToEdit) {
      // Create 4 distinct tickets representing the package
      const ticketsArray: Partial<Ticket>[] = [
        {
          pessoaEmail: pessoaEmail.trim(),
          requireSystem: 'Azure AD (BEES Tenant)',
          role: 'AADS_A_BEES_CONSUMER_MARKETING_AMERICA',
          equipe,
          url: url.trim(),
          status,
          employeeId: employeeId.trim(),
          dataAbertura,
          prioridade,
          dataInclusao: formattedInclusionDate
        },
        {
          pessoaEmail: pessoaEmail.trim(),
          requireSystem: 'Confluence Guest',
          role: 'Confluence  Guest(Martech Data & Measurement pages)',
          equipe,
          url: url.trim(),
          status,
          employeeId: employeeId.trim(),
          dataAbertura,
          prioridade,
          dataInclusao: formattedInclusionDate
        },
        {
          pessoaEmail: pessoaEmail.trim(),
          requireSystem: 'Azure DevOps',
          role: 'Sem Função / Acesso Básico',
          equipe,
          url: url.trim(),
          status,
          employeeId: employeeId.trim(),
          dataAbertura,
          prioridade,
          dataInclusao: formattedInclusionDate
        },
        {
          pessoaEmail: pessoaEmail.trim(),
          requireSystem: 'AD Group - Unity Catalog',
          role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ENGINEER', // Cópia solicitada
          equipe,
          url: url.trim(),
          status,
          employeeId: employeeId.trim(),
          dataAbertura,
          prioridade,
          dataInclusao: formattedInclusionDate
        }
      ];

      onSave(ticketsArray);
      setSuccessMsg('Pacote Acesso Full cadastrado com sucesso!');
    } else {
      const ticketData: Partial<Ticket> = {
        pessoaEmail: pessoaEmail.trim(),
        requireSystem,
        role,
        equipe,
        url: url.trim(),
        status,
        employeeId: employeeId.trim(),
        dataAbertura,
        prioridade,
        // If editing, preserve original dataInclusao or set new if none
        dataInclusao: ticketToEdit?.dataInclusao || formattedInclusionDate
      };

      if (ticketToEdit) {
        ticketData.id = ticketToEdit.id;
      }

      onSave(ticketData);
      setSuccessMsg(ticketToEdit ? 'Chamado atualizado com sucesso!' : 'Chamado cadastrado com sucesso!');
    }
    
    if (!ticketToEdit) {
      resetForm();
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden" id="ticket-form">
      {/* Header Container */}
      <div className="bg-slate-950 px-6 py-5 flex items-center justify-between border-b border-slate-800 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 text-slate-950 rounded-xl shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">
              {ticketToEdit ? 'Editar Chamado' : 'Formulário de Cadastro'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {ticketToEdit ? `Modificando chamado ID #${ticketToEdit.id.slice(0, 8)}` : 'Preencha os dados e salve na Planilha'}
            </p>
          </div>
        </div>
        {ticketToEdit && (
          <button
            onClick={onCancelEdit}
            className="text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-md font-medium transition cursor-pointer"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {/* Alerts */}
        {errorMsg && (
          <div className="flex items-start gap-2 bg-red-50 border-l-4 border-red-500 p-3.5 rounded-r-lg text-red-700 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-500 p-3.5 rounded-r-lg text-green-700 text-sm">
            <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Email / Pessoas with Autocomplete */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-gray-400" />
              Pessoa (E-mail de Cadastro) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="input-pessoa-email"
              value={pessoaEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              onFocus={() => {
                if (pessoaEmail && !pessoaEmail.includes('@')) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="ex: joao.silva"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-gray-400"
              autoComplete="off"
            />
            
            {/* Suggestion list */}
            {showSuggestions && emailSuggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-lg max-h-52 overflow-y-auto divide-y divide-gray-50 overflow-hidden"
              >
                <div className="px-3 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Sugestões de Domínio
                </div>
                {emailSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectEmailSuggestion(suggestion)}
                    className="w-full text-left px-3.5 py-2 hover:bg-amber-50 text-sm text-gray-700 font-medium hover:text-amber-950 transition-colors flex items-center justify-between"
                  >
                    <span>{suggestion}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Atalho</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Quick Helper Domains Buttons */}
            <div className="flex flex-wrap gap-1 mt-1.5 text-xs text-gray-500">
              <span className="text-[10px] uppercase font-bold text-gray-400 mr-1 mt-1">Domínios permitidos:</span>
              {EMAIL_DOMAINS.map((dom) => (
                <button
                  type="button"
                  key={dom}
                  onClick={() => {
                    // If email already contains @, replace domain or append
                    const atIdx = pessoaEmail.indexOf('@');
                    const prefix = atIdx !== -1 ? pessoaEmail.substring(0, atIdx) : (pessoaEmail || 'usuario');
                    setPessoaEmail(`${prefix}${dom}`);
                  }}
                  className="bg-gray-100 hover:bg-amber-50 hover:text-amber-700 text-gray-600 px-2 py-0.5 rounded border border-gray-200 transition text-[11px] font-medium"
                >
                  {dom}
                </button>
              ))}
            </div>

            {/* Acesso Full Option Checkbox */}
            {!ticketToEdit && (
              <div className="group mt-4 p-3.5 bg-rose-50/70 hover:bg-rose-50 rounded-xl border-2 border-rose-200 hover:border-rose-300 flex flex-col gap-0.5 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="checkbox-acesso-full"
                    checked={acessoFull}
                    onChange={(e) => setAcessoFull(e.target.checked)}
                    className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 accent-rose-500 cursor-pointer"
                  />
                  <label htmlFor="checkbox-acesso-full" className="select-none text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer flex-1">
                    <Sparkles className="h-4 w-4 text-rose-500 animate-pulse" />
                    Solicitar Pacote Acesso Full (Todos os 4 Sistemas)
                  </label>
                  <span className="text-[9px] bg-rose-200 text-rose-900 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">4 Chamados</span>
                </div>
                {/* Collapsible explaining text visible on hover or check! */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${acessoFull ? 'max-h-[350px] opacity-100 mt-2 pt-2 border-t border-rose-200' : 'max-h-0 opacity-0 group-hover:max-h-[350px] group-hover:opacity-100 group-hover:mt-2 group-hover:pt-2 group-hover:border-t group-hover:border-rose-200'}`}>
                  <p className="text-[11px] text-rose-800 font-bold leading-relaxed pl-1.5">
                    Este modo criará simultaneamente 4 chamados independentes na planilha. Veja os sistemas e as roles que serão geradas para o usuário:
                  </p>
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[9px] text-rose-900">
                    <div className="p-2 bg-white rounded border border-rose-200 shadow-3xs">
                      <b className="text-rose-950 block border-b border-rose-100 pb-0.5 mb-1">1. Azure AD (BEES)</b>
                      Role: AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA
                    </div>
                    <div className="p-2 bg-white rounded border border-rose-200 shadow-3xs">
                      <b className="text-rose-950 block border-b border-rose-100 pb-0.5 mb-1">2. Confluence Guest</b>
                      Role: Confluence Guest (Martech Data & Measurement pages)
                    </div>
                    <div className="p-2 bg-white rounded border border-rose-200 shadow-3xs">
                      <b className="text-rose-950 block border-b border-rose-100 pb-0.5 mb-1">3. Azure DevOps</b>
                      Role: AADS_A_BEES_UC_CONSUMER_MARKETING_ENGINEER
                    </div>
                    <div className="p-2 bg-white rounded border border-rose-200 shadow-3xs">
                      <b className="text-rose-950 block border-b border-rose-100 pb-0.5 mb-1">4. AD Group</b>
                      Role: AADS_A_BEES_UC_CONSUMER_MARKETING_ADMIN
                    </div>
                  </div>
                  <p className="text-[9px] text-rose-700/80 italic mt-2.5 pl-1.5">
                    *Nota: As permissões são configuradas automaticamente de acordo com as politicas Martech. Os seletores de Sistema e Role ficarão bloqueados no formulário.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-gray-400" />
              Employee ID (ID do Funcionário)
            </label>
            <input
              type="text"
              id="input-employee-id"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Ex: 10045231"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-gray-400"
            />
          </div>

          {/* Require System */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Shield className={`h-3.5 w-3.5 ${acessoFull ? 'text-rose-400' : 'text-gray-400'}`} />
              Sistema Necessário (Require System) {acessoFull && <span className="text-[10px] text-rose-600 font-bold uppercase">(Bloqueado - Acesso Full)</span>}
            </label>
            <select
              id="input-require-system"
              value={acessoFull ? "Múltiplos (Acesso Full)" : requireSystem}
              onChange={(e) => setRequireSystem(e.target.value)}
              disabled={acessoFull}
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all font-medium ${
                acessoFull 
                  ? 'bg-rose-50/75 border-rose-200 text-rose-500 font-bold cursor-not-allowed filter saturate-50' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500'
              }`}
            >
              {acessoFull ? (
                <option value="Múltiplos (Acesso Full)">Mapeando 4 Sistemas em chamados distintos...</option>
              ) : (
                <>
                  <option value="">Selecione um sistema...</option>
                  {REQUIRE_SYSTEMS.map((sys) => (
                    <option key={sys} value={sys}>{sys}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <HelpCircle className={`h-3.5 w-3.5 ${acessoFull ? 'text-rose-400' : 'text-gray-400'}`} />
              Função (Role) {acessoFull && <span className="text-[10px] text-rose-600 font-bold uppercase">(Bloqueado - Acesso Full)</span>}
            </label>
            <select
              id="input-role"
              value={acessoFull ? "Múltiplos (Acesso Full)" : role}
              onChange={(e) => setRole(e.target.value)}
              disabled={acessoFull}
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all font-medium ${
                acessoFull 
                  ? 'bg-rose-50/75 border-rose-200 text-rose-500 font-bold cursor-not-allowed filter saturate-50' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500'
              }`}
            >
              {acessoFull ? (
                <option value="Múltiplos (Acesso Full)">Determinando Roles corporativas correspondentes...</option>
              ) : (
                <>
                  <option value="">Selecione uma role...</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Equipe / Team */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              Equipe de Destino (Team)
            </label>
            <select
              id="input-equipe"
              value={equipe}
              onChange={(e) => setEquipe(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
            >
              <option value="">Selecione uma equipe...</option>
              {EQUIPES.map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          {/* URL Reference */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Link className="h-3.5 w-3.5 text-gray-400" />
              URL de Referência
            </label>
            <input
              type="text"
              id="input-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Ex: https://jira.com/task-123"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-gray-400"
            />
          </div>

          {/* Data de abertura (with custom Toolbox) */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              Data de Abertura <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1.5 items-center">
              <input
                type="date"
                id="input-data-abertura"
                value={dataAbertura}
                onChange={(e) => setDataAbertura(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
              />
            </div>
            {/* Quick toolbox ("abra um toolbox de tada") */}
            <div className="flex items-center gap-1.5 mt-1.5 bg-amber-50/70 p-2 rounded-lg border border-amber-100">
              <Clock className="h-3 w-3 text-amber-600" />
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide mr-1 select-none">Atalhos de data:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setQuickDate(0)}
                  className="bg-white text-gray-700 border border-gray-200 hover:border-amber-500 hover:text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs transition"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="bg-white text-gray-700 border border-gray-200 hover:border-amber-500 hover:text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs transition"
                >
                  Ontem
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(3)}
                  className="bg-white text-gray-700 border border-gray-200 hover:border-amber-500 hover:text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs transition"
                >
                  -3 dias
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="bg-white text-gray-700 border border-gray-200 hover:border-amber-500 hover:text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs transition"
                >
                  -7 dias
                </button>
              </div>
            </div>
          </div>

          {/* Ticket Priority */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Prioridade <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((prio) => {
                const isSelected = prioridade === prio;
                const colors = {
                  baixa: 'bg-green-50 text-green-700 border-green-200 ring-green-500/20 hover:bg-green-100',
                  normal: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20 hover:bg-blue-100',
                  alta: 'bg-red-50 text-red-700 border-red-200 ring-red-500/20 hover:bg-red-100'
                };
                const activeColors = {
                  baixa: 'bg-green-600 text-white border-green-600 ring-2 ring-green-600/30 hover:bg-green-700',
                  normal: 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-600/30 hover:bg-blue-700',
                  alta: 'bg-red-600 text-white border-red-600 ring-2 ring-red-600/30 hover:bg-red-700'
                };
                return (
                  <button
                    type="button"
                    key={prio}
                    onClick={() => setPrioridade(prio)}
                    className={`py-2 px-3 border rounded-lg text-xs font-bold uppercase tracking-wider transition-all text-center cursor-pointer ${
                      isSelected ? activeColors[prio] : colors[prio]
                    }`}
                  >
                    {prio}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ticket Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              Status de Andamento <span className="text-red-500">*</span>
            </label>
            <select
              id="input-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TicketStatus)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          {!ticketToEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              Limpar Campos
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 text-amber-950 ${ticketToEdit ? 'animate-spin' : ''}`} />
            {ticketToEdit ? 'Atualizar na Planilha' : 'Gravar na Planilha'}
          </button>
        </div>

      </form>
    </div>
  );
}
