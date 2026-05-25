import React, { useState, useEffect, useRef } from 'react';
import { Ticket, TicketPriority, TicketStatus, REQUIRE_SYSTEMS, ROLES, EQUIPES, EMAIL_DOMAINS } from '../types';
import { 
  Calendar, User, Shield, HelpCircle, Users, Link, Key, 
  Clock, AlertTriangle, CheckCircle, RefreshCw, Upload, 
  FileText, ArrowLeft, Info, ChevronRight, Check, X, Plane, Globe
} from 'lucide-react';

interface TicketForm2Props {
  onSave: (ticket: Partial<Ticket> | Partial<Ticket>[]) => void;
  ticketToEdit?: Ticket | null;
  onCancelEdit?: () => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info', title?: string) => void;
}

export default function TicketForm2({ onSave, ticketToEdit, onCancelEdit, showToast }: TicketForm2Props) {
  // Input states mimicking Atlassian / Jira Create Request 7022
  const [resumo, setResumo] = useState('');
  const [pessoaEmail, setPessoaEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [requireSystem, setRequireSystem] = useState('');
  const [role, setRole] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [zona, setZona] = useState('COPEC');
  const [justificativa, setJustificativa] = useState('');
  const [prioridade, setPrioridade] = useState<TicketPriority>('normal');
  const [equipe, setEquipe] = useState('');
  const [status, setStatus] = useState<TicketStatus>('Aberto');
  const [dataAbertura, setDataAbertura] = useState('');
  const [url, setUrl] = useState('');

  // Attachment Simulation
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // UI Autocomplete state
  const [userEmailSuggestions, setUserEmailSuggestions] = useState<string[]>([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [managerEmailSuggestions, setManagerEmailSuggestions] = useState<string[]>([]);
  const [showManagerSuggestions, setShowManagerSuggestions] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const userSuggestionsRef = useRef<HTMLDivElement>(null);
  const managerSuggestionsRef = useRef<HTMLDivElement>(null);

  // Default team mapping or custom mappings for Jira groups
  useEffect(() => {
    if (ticketToEdit) {
      setResumo(ticketToEdit.resumo || `Solicitação de Acesso - ${ticketToEdit.pessoaEmail.split('@')[0]}`);
      setPessoaEmail(ticketToEdit.pessoaEmail);
      setEmployeeId(ticketToEdit.employeeId);
      setRequireSystem(ticketToEdit.requireSystem);
      setRole(ticketToEdit.role);
      setManagerEmail(ticketToEdit.managerEmail || '');
      setZona(ticketToEdit.zona || 'COPEC');
      setJustificativa(ticketToEdit.justificativa || '');
      setPrioridade(ticketToEdit.prioridade);
      setEquipe(ticketToEdit.equipe || '');
      setStatus(ticketToEdit.status);
      setDataAbertura(ticketToEdit.dataAbertura);
      setUrl(ticketToEdit.url || '');
      setAttachedFile(ticketToEdit.anexoNome || null);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setDataAbertura(today);
      resetForm();
    }
  }, [ticketToEdit]);

  // Handle outside click to hide suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userSuggestionsRef.current && !userSuggestionsRef.current.contains(event.target as Node)) {
        setShowUserSuggestions(false);
      }
      if (managerSuggestionsRef.current && !managerSuggestionsRef.current.contains(event.target as Node)) {
        setShowManagerSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetForm = () => {
    setResumo('');
    setPessoaEmail('');
    setEmployeeId('');
    setRequireSystem('');
    setRole('');
    setManagerEmail('');
    setZona('COPEC');
    setJustificativa('');
    setPrioridade('normal');
    setEquipe('Martech');
    setStatus('Aberto');
    setUrl('');
    const today = new Date().toISOString().split('T')[0];
    setDataAbertura(today);
    setAttachedFile(null);
    setErrorMsg('');
  };

  // Autocomplete change handlers
  const handleUserEmailChange = (val: string) => {
    setPessoaEmail(val);
    if (!val || val.includes('@')) {
      setUserEmailSuggestions([]);
      setShowUserSuggestions(false);
      return;
    }
    const suggestions = EMAIL_DOMAINS.map(domain => `${val.trim()}${domain}`);
    setUserEmailSuggestions(suggestions);
    setShowUserSuggestions(true);
  };

  const handleManagerEmailChange = (val: string) => {
    setManagerEmail(val);
    if (!val || val.includes('@')) {
      setManagerEmailSuggestions([]);
      setShowManagerSuggestions(false);
      return;
    }
    const suggestions = EMAIL_DOMAINS.map(domain => `${val.trim()}${domain}`);
    setManagerEmailSuggestions(suggestions);
    setShowManagerSuggestions(true);
  };

  // Drag-and-Drop Simulator
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachedFile(e.dataTransfer.files[0].name);
      if (showToast) {
        showToast(`Documento ${e.dataTransfer.files[0].name} anexado com sucesso!`, 'info', 'ANEXO JIRA');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!pessoaEmail.trim()) {
      const msg = 'O e-mail do usuário beneficiário é obrigatório.';
      setErrorMsg(msg);
      if (showToast) showToast(msg, 'error', 'CAMPO OBRIGATÓRIO');
      return;
    }

    if (!pessoaEmail.includes('@')) {
      const msg = 'Por favor, insira um e-mail de beneficiário válido (ex: nome@ab-inbev.com).';
      setErrorMsg(msg);
      if (showToast) showToast(msg, 'error', 'E-MAIL INVÁLIDO');
      return;
    }

    if (managerEmail && !managerEmail.includes('@')) {
      const msg = 'Se preenchido, o e-mail do gestor deve ser válido.';
      setErrorMsg(msg);
      if (showToast) showToast(msg, 'error', 'E-MAIL DO GESTOR INVÁLIDO');
      return;
    }

    if (!requireSystem) {
      const msg = 'Selecione o Sistema Necessário.';
      setErrorMsg(msg);
      if (showToast) showToast(msg, 'error', 'SISTEMA REQUERIDO');
      return;
    }

    const compiledSummary = resumo.trim() || `Solicitação de Acesso (${requireSystem}) - ${pessoaEmail.split('@')[0]}`;
    
    // Auto-generate Jira reference link if none provided
    const randomJiraNumber = Math.floor(62000 + Math.random() * 3000);
    const compiledUrl = url.trim() || `https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-${randomJiraNumber}?created=true`;

    const now = new Date();
    const formattedInclusionDate = now.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Save compatible ticket structure
    const ticketData: Partial<Ticket> = {
      pessoaEmail: pessoaEmail.trim(),
      requireSystem,
      role: role || 'Sem Função / Acesso Básico',
      equipe: equipe || 'Martech',
      url: compiledUrl,
      status,
      employeeId: employeeId.trim(),
      dataAbertura,
      prioridade,
      dataInclusao: ticketToEdit?.dataInclusao || formattedInclusionDate,
      
      // Form 2.0 specs
      resumo: compiledSummary,
      managerEmail: managerEmail.trim(),
      justificativa: justificativa.trim(),
      zona,
      anexoNome: attachedFile || undefined
    };

    if (ticketToEdit) {
      ticketData.id = ticketToEdit.id;
    }

    onSave(ticketData);
    setSuccessMsg(ticketToEdit ? 'Chamado 2.0 atualizado na Planilha com sucesso!' : 'Novo Chamado registrado na Planilha via Portal 2.0!');
    
    if (showToast) {
      showToast(
        ticketToEdit ? 'Chamado atualizado no banco!' : 'Solicitação criada no Portal Jira 2.0!', 
        'success', 
        ticketToEdit ? 'ATUALIZADO (FORM 2.0)' : 'PROCESSADO (PORTAL 2.0)'
      );
    }

    if (!ticketToEdit) {
      resetForm();
    }

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800" id="jira-customer-portal-mock">
      
      {/* Dynamic Header imitating Jira Cloud Help Center Branding */}
      <div className="bg-[#172B4D] text-white px-6 py-8 border-b border-[#091E42]/20">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5 text-xs text-sky-200/80 font-medium">
            <span>Portal do Cliente</span>
            <ChevronRight className="h-3 w-3 text-sky-200/40" />
            <span>BEES Identity & Access Management (BEESFIAM)</span>
            <ChevronRight className="h-3 w-3 text-sky-200/40" />
            <span className="text-white hover:underline cursor-pointer">Grupo 3052 &gt; Criação de Chamado 7022</span>
          </div>
          
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="bg-[#0052CC] h-12 w-12 rounded-lg flex items-center justify-center font-extrabold text-white text-xl border border-sky-400 shadow-sm shrink-0">
                Jira
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Solicitação de Acesso (Cod. 7022 - Martech/BEES)
                  <span className="text-[10px] bg-sky-500/30 text-sky-200 border border-sky-400/40 px-2 py-0.5 rounded font-black uppercase tracking-wider">Beta 2.0</span>
                </h1>
                <p className="text-xs sm:text-sm text-sky-200/90 max-w-2xl font-medium mt-0.5">
                  Preencha este formulário para solicitar permissões corporativas no Azure AD, DevOps, Unity Catalog e Confluence para a equipe Martech.
                </p>
              </div>
            </div>
            {ticketToEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 transition border border-white/20 select-none cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Retornar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Banner Informational SOX Auditable Area */}
        <div className="bg-sky-50 border-l-4 border-[#0747A6] rounded-r-xl p-4 mb-6 flex items-start gap-3 shadow-3xs">
          <Info className="h-5 w-5 text-[#0747A6] shrink-0 mt-0.5" />
          <div className="text-xs text-[#0747A6]/90 leading-relaxed font-medium">
            <p className="font-extrabold uppercase tracking-wide text-[#0747A6] mb-0.5">Controle de Conformidade SOX (Grupo 3052)</p>
            Esta requisição disparará fluxos de aprovação automáticos no Jira Service Desk para o gestor reportado. Certifique-se de que o **Employee ID** e o **E-mail do Gestor** correspondem aos registros ativos no Workday corporativo.
          </div>
        </div>

        {/* Global Success / Error Alert boxes */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 mb-6 flex items-start gap-3 shadow-3xs animate-in slide-in-from-top duration-300">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-extrabold uppercase">Erro de Validação Atlassian:</span>
              <p className="mt-1 font-medium">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-6 flex items-start gap-3 shadow-3xs animate-in slide-in-from-top duration-300">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-extrabold uppercase">Requisição Cadastrada com Sucesso!</span>
              <p className="mt-1 font-medium">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Main Content Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Side (left 2/3) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-3xs">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="h-4 w-4 text-[#0052CC]" /> Detalhes do Novo Chamado
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold border border-amber-200 rounded px-2 py-0.5 uppercase tracking-wider animate-pulse">
                Modo Sincronizado
              </span>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              
              {/* SUMMARY/RESUMO (JIRA FIELD) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Resumo do Chamado (Sumário Jira)
                </label>
                <input
                  type="text"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  placeholder="Ex: Acesso Azure AD e Unity Catalog para novo Analista de Dados"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/15 focus:border-[#0052CC] transition"
                />
                <p className="text-[10px] text-slate-400 font-medium">Faça uma descrição breve e clara do propósito deste chamado.</p>
              </div>

              {/* TWO COLUMN GRID: BENEFICIARY EMAIL & EMPLOYEE ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Beneficiary Email (Pessoa) */}
                <div className="relative space-y-1.5">
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-wide">
                    Beneficiário do Acesso (E-mail) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={pessoaEmail}
                      onChange={(e) => handleUserEmailChange(e.target.value)}
                      onFocus={() => {
                        if (pessoaEmail && !pessoaEmail.includes('@')) {
                          setShowUserSuggestions(true);
                        }
                      }}
                      placeholder="Ex: joao.silva"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/15 focus:border-[#0052CC] transition"
                      autoComplete="off"
                    />
                  </div>
                  
                  {/* Suggestion modal overlay */}
                  {showUserSuggestions && userEmailSuggestions.length > 0 && (
                    <div 
                      ref={userSuggestionsRef}
                      className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg max-h-48 overflow-y-auto divide-y divide-slate-50"
                    >
                      <div className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Domínios Corporativos
                      </div>
                      {userEmailSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPessoaEmail(suggestion);
                            setShowUserSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-sky-50 text-xs text-slate-700 font-bold transition flex items-center justify-between"
                        >
                          <span>{suggestion}</span>
                          <span className="text-[9px] bg-sky-100 text-sky-800 px-1 py-0.5 rounded font-black uppercase">SSO</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Autocomplete Quick Badges */}
                  <div className="flex gap-1 flex-wrap mt-1">
                    {EMAIL_DOMAINS.map((domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => {
                          const atSymbol = pessoaEmail.indexOf('@');
                          const prefix = atSymbol !== -1 ? pessoaEmail.slice(0, atSymbol) : (pessoaEmail || 'colaborador');
                          setPessoaEmail(`${prefix}${domain}`);
                        }}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-650 px-2 py-0.5 rounded-md border border-slate-200 font-bold tracking-tight transition"
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Employee ID */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-wide">
                    Employee ID (Workday ID)
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="Ex: 10059341"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/15 focus:border-[#0052CC] transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">8 dígitos numéricos no crachá do funcionário.</p>
                </div>
              </div>

              {/* TWO COLUMN GRID: DIRECT MANAGER & ZONE/PAÍS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Manager Email */}
                <div className="relative space-y-1.5">
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-wide flex items-center gap-1.5">
                    E-mail do Gestor Direto (Manager)
                    <span className="text-[9px] bg-slate-100 text-slate-500 border rounded px-1 font-extrabold uppercase tracking-widest">Aprovação SOX</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={managerEmail}
                      onChange={(e) => handleManagerEmailChange(e.target.value)}
                      onFocus={() => {
                        if (managerEmail && !managerEmail.includes('@')) {
                          setShowManagerSuggestions(true);
                        }
                      }}
                      placeholder="Ex: gestor.martech"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/15 focus:border-[#0052CC] transition"
                    />
                  </div>

                  {/* Manager suggestions */}
                  {showManagerSuggestions && managerEmailSuggestions.length > 0 && (
                    <div 
                      ref={managerSuggestionsRef}
                      className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg max-h-48 overflow-y-auto divide-y divide-slate-50"
                    >
                      <div className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Domínios Corporativos
                      </div>
                      {managerEmailSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setManagerEmail(suggestion);
                            setShowManagerSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-sky-50 text-xs text-slate-700 font-bold transition flex items-center justify-between"
                        >
                          <span>{suggestion}</span>
                          <span className="text-[9px] bg-sky-100 text-sky-800 px-1 py-0.5 rounded font-black uppercase">Gestor</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Zona de Destino (ABI Zone dropdown) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-wide flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-slate-450" /> Zona / Região Corporativa
                  </label>
                  <select
                    value={zona}
                    onChange={(e) => setZona(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0052CC]/15 focus:border-[#0052CC] transition"
                  >
                    <option value="COPEC">COPEC (AmBev Brasil & Rio de la Plata)</option>
                    <option value="North America">North America (Anheuser-Busch & Labatt)</option>
                    <option value="Middle Americas">Middle Americas (Mexico, Colombia, BAC)</option>
                    <option value="Europe">Europe (UK, Belgium, Germany)</option>
                    <option value="Africa">Africa (SAB, East & West Africa)</option>
                    <option value="APAC">APAC (Budweiser APAC, East Asia)</option>
                  </select>
                </div>
              </div>

              {/* TWO COLUMN GRID: SYSTEM SELECTOR & DESIGNATED ROLE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Sistema Necessário */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-wide flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-slate-450" /> Sistema Requerido <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={requireSystem}
                    onChange={(e) => setRequireSystem(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0052CC]/15 focus:border-[#0052CC] transition"
                  >
                    <option value="">Selecione o sistema corporativo...</option>
                    {REQUIRE_SYSTEMS.map((sys) => (
                      <option key={sys} value={sys}>{sys}</option>
                    ))}
                  </select>
                </div>

                {/* Designated Role (Dropdown options based on selected system of Form 1.0) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-705 uppercase tracking-wide flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-450" /> Perfil / Função Desejada (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0052CC]/15 focus:border-[#0052CC] transition"
                  >
                    <option value="">Selecione a role correspondente...</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* THREE COLUMN DETAILS (Team, Priority, Status) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-205 rounded-xl">
                {/* Target Team */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Grupo de Destino
                  </label>
                  <select
                    value={equipe}
                    onChange={(e) => setEquipe(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {EQUIPES.map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>

                {/* SLA Priority */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    SLA / Prioridade
                  </label>
                  <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                    {(['baixa', 'normal', 'alta'] as TicketPriority[]).map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPrioridade(p)}
                        className={`flex-1 py-1 rounded text-[10px] font-extrabold uppercase transition-all select-none ${
                          prioridade === p 
                            ? p === 'alta' 
                              ? 'bg-red-600 text-white' 
                              : p === 'normal' 
                                ? 'bg-sky-600 text-white' 
                                : 'bg-emerald-600 text-white'
                            : 'bg-transparent text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Request Status */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Status de Lote
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TicketStatus)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="Aberto">Aberto</option>
                    <option value="Em Atendimento">Em Atendimento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Fechada">Fechada (Jira)</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* BUSINESS JUSTIFICATION (TextArea) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Justificativa de Negócios / Business Justification
                </label>
                <textarea
                  rows={3}
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  placeholder="Descreva detalhadamente as demandas de rotina ou conexões de API que justificam este nível de privilégio no sistema..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/15 focus:border-[#0052CC] transition resize-none"
                />
                <p className="text-[10px] text-slate-400 font-medium">Obrigatória para acessos privilegiados de Auditoria SOX.</p>
              </div>

              {/* JIRA CUSTOMER PORTAL FILE UPLOAD CLONE AREA */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                  <span>Anexos / Comprovações Adicionais</span>
                  <span className="text-[10px] text-slate-400 lowercase italic font-normal">Opcional (máx. 10MB)</span>
                </label>

                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                    isDragging 
                      ? 'border-[#0052CC] bg-sky-50' 
                      : attachedFile 
                        ? 'border-emerald-300 bg-emerald-50/20' 
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100/50 hover:border-[#0052CC]'
                  }`}
                >
                  <input
                    type="file"
                    id="jira-file-upload-input"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {attachedFile ? (
                    <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-lg p-3 max-w-sm mx-auto shadow-3xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-750">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[180px]" title={attachedFile}>{attachedFile}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="text-xs text-rose-650 hover:text-rose-800 font-black px-2 py-1 select-none cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="jira-file-upload-input" className="cursor-pointer space-y-1.5 block">
                      <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                      <span className="text-xs font-bold text-[#0052CC] block hover:underline">
                        Clique para anexar arquivos
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium font-sans">
                        ou arraste e solte o escaneamento de aprovação por e-mail aqui
                      </p>
                    </label>
                  )}
                </div>
              </div>

              {/* SUBMISSION FOOTER REGION */}
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs bg-slate-100 text-slate-650 hover:text-slate-800 hover:bg-slate-200 font-bold py-2.5 px-5 rounded-lg transition select-none cursor-pointer"
                >
                  Limpar Todos os Campos
                </button>
                <div className="flex items-center gap-3">
                  {onCancelEdit && ticketToEdit && (
                    <button
                      type="button"
                      onClick={onCancelEdit}
                      className="text-xs text-slate-600 hover:bg-slate-100 font-bold py-2.5 px-4 rounded-lg select-none cursor-pointer"
                    >
                      Cancelar Edição
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-[#0052CC] hover:bg-[#0747A6] text-white text-xs font-extrabold py-3 px-6 rounded-lg shadow-sm transition-all duration-150 transform active:scale-98 flex items-center gap-2 select-none cursor-pointer"
                  >
                    <Check className="h-4 w-4 shrink-0 text-white" />
                    <span>{ticketToEdit ? 'Salvar Edição 2.0' : 'Criar Solicitação no Jira'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* Sidebar Info Section (right 1/3) */}
          <div className="space-y-6">
            
            {/* SLA SLA Information box */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100">
                <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" /> Diretrizes de SLA & Suporte
                </h4>
              </div>
              <div className="p-5 space-y-4 text-xs leading-relaxed font-sans text-slate-700">
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-800 block">Tempo médio de Resolução</span>
                  <p className="text-slate-550 text-[11px]">
                    Até <strong>4 horas úteis</strong> para prioridade "Alta". Chamados rotineiros de nível "Baixa" integram em até 24h.
                  </p>
                </div>
                <hr className="border-slate-100" />
                <div className="space-y-1 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
                  <span className="font-extrabold text-amber-900 block flex items-center gap-1">
                    ⚠️ Aprovador Necessário
                  </span>
                  <p className="text-amber-800 text-[11px] font-medium leading-normal">
                    Este tipo de chamado requer o endereço de e-mail do seu <strong>Line Manager</strong> corporativo. O portal enviará um webhook automático para sua caixa de entrada Atlassian.
                  </p>
                </div>
                <hr className="border-slate-100" />
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-800 block">Sistemas Autônomos</span>
                  <p className="text-slate-550 text-[11px]">
                    Azure Active Directory e Databricks Unity Catalog estão integrados às rotinas de sincronia turbo da planilha em tempo real.
                  </p>
                </div>
              </div>
            </div>

            {/* Jira Service Desk Support Resources */}
            <div className="bg-[#EBECF0]/60 rounded-xl p-5 border border-slate-200/80 space-y-3.5 font-sans">
              <span className="font-black text-[#091E42] text-[10px] uppercase tracking-widest block">Recursos Úteis</span>
              <ul className="space-y-2.5 text-xs text-slate-650">
                <li>
                  <a href="https://ab-inbev.atlassian.net/wiki/spaces/IAM" target="_blank" rel="noreferrer" className="text-[#0052CC] font-bold hover:underline flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0052CC]"></span> Documentação Confluence IAM
                  </a>
                </li>
                <li>
                  <a href="https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380" target="_blank" rel="noreferrer" className="text-[#0052CC] font-bold hover:underline flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0052CC]"></span> Central do Cliente BEESFIAM
                  </a>
                </li>
                <li>
                  <span className="text-slate-500 font-semibold cursor-default flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span> Suporte Ambev IT: Ramal 2901
                  </span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
