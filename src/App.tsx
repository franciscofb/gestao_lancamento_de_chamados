import React, { useState, useEffect } from 'react';
import { Ticket } from './types';
import TicketForm from './components/TicketForm';
import TicketForm2 from './components/TicketForm2';
import SheetDatabase from './components/SheetDatabase';
import Dashboard from './components/Dashboard';
import ToastNotification, { Toast } from './components/ToastNotification';
import { 
  FileText, Database, BarChart3, HelpCircle, Shield, 
  CheckCircle, PlusCircle, AlertCircle, RefreshCw, Zap
} from 'lucide-react';

// Key for storage persistence
const STORAGE_KEY = 'ab_inbev_tickets_db_v8';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'form2' | 'sheet' | 'dash'>('form');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', title?: string) => {
    const id = Math.random().toString(36).substring(2, 11).toUpperCase();
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Load records from LocalStorage on mount
  useEffect(() => {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      try {
        setTickets(JSON.parse(rawData));
      } catch (err) {
        console.error('Falha ao ler dados do LocalStorage, carregando base zerada', err);
        setTickets([]);
      }
    } else {
      // Auto-load beautiful demo records on very first boot
      loadSampleDemoData();
    }
  }, []);

  // Sync to spreadsheet simulation database helper
  const saveAndSyncTickets = (newTickets: Ticket[]) => {
    setTickets(newTickets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTickets));
  };

  // Seed Data Generator for quick preview and analytical accuracy
  const loadSampleDemoData = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const sampleDemoTickets: Ticket[] = [
      {
        id: 'T-FSO903',
        pessoaEmail: 'anderson.barbosa@ab-inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'BPCS',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-62170?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: sevenDaysAgoStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 604800000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JJR292',
        pessoaEmail: 'gregory.peruzzofiel-ext@ab-inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'BPCS',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-62171?created=true',
        status: 'Fechada',
        employeeId: '',
        dataAbertura: today,
        prioridade: 'normal',
        dataInclusao: new Date().toLocaleString('pt-BR')
      },
      {
        id: 'T-MST184',
        pessoaEmail: 'mike.sturwold@labatt.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64098?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-AMN901',
        pessoaEmail: 'carla.oliveiranascimento@ab-inbev.com',
        requireSystem: 'AD Group - Unity Catalog',
        role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ENGINEER',
        equipe: 'Martech',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63977?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JMS842',
        pessoaEmail: 'mike.sturwold@labatt.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63972?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: today,
        prioridade: 'normal',
        dataInclusao: new Date().toLocaleString('pt-BR')
      },
      {
        id: 'T-PNT301',
        pessoaEmail: 'ramdas.murali@anheuser-busch.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63974?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: threeDaysAgoStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 259200000).toLocaleString('pt-BR')
      },
      {
        id: 'T-AWM211',
        pessoaEmail: 'Allison.Williams-ext@ab-Inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'BPCS',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-62164?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: sevenDaysAgoStr,
        prioridade: 'alta',
        dataInclusao: new Date(Date.now() - 604800000).toLocaleString('pt-BR')
      },
      {
        id: 'T-KSV832',
        pessoaEmail: 'Kranthi.Sarva-ext@ab-Inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'BPCS',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-62165?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: sevenDaysAgoStr,
        prioridade: 'alta',
        dataInclusao: new Date(Date.now() - 604800000).toLocaleString('pt-BR')
      },
      {
        id: 'T-AHP741',
        pessoaEmail: 'Anthony.Hamption-ext@ab-Inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'BPCS',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-62167?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: sevenDaysAgoStr,
        prioridade: 'alta',
        dataInclusao: new Date(Date.now() - 604800000).toLocaleString('pt-BR')
      },
      {
        id: 'T-LVD394',
        pessoaEmail: 'Luke.Vonderharr-ext@ab-Inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'BPCS',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-62169?created=true',
        status: 'Cancelado',
        employeeId: '',
        dataAbertura: sevenDaysAgoStr,
        prioridade: 'alta',
        dataInclusao: new Date(Date.now() - 604800000).toLocaleString('pt-BR')
      },
      {
        id: 'T-BBZ101',
        pessoaEmail: 'bruno.braziel@ab-inbev.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence (Martech and Martech Data & Measurement pages)',
        equipe: 'BrewDat',
        url: '',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: threeDaysAgoStr,
        prioridade: 'alta',
        dataInclusao: new Date(Date.now() - 259200000).toLocaleString('pt-BR')
      },
      {
        id: 'T-BBZ102',
        pessoaEmail: 'bruno.braziel@ab-inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'BrewDat',
        url: '',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: threeDaysAgoStr,
        prioridade: 'alta',
        dataInclusao: new Date(Date.now() - 259200000).toLocaleString('pt-BR')
      },
      {
        id: 'T-BBZ103',
        pessoaEmail: 'bruno.braziel@ab-inbev.com',
        requireSystem: 'AD Group - Unity Catalog',
        role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ADMIN',
        equipe: 'BrewDat',
        url: '',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: threeDaysAgoStr,
        prioridade: 'alta',
        dataInclusao: new Date(Date.now() - 259200000).toLocaleString('pt-BR')
      },
      {
        id: 'T-VVS291',
        pessoaEmail: 'vysakh.viswan@ab-inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'BrewDat',
        url: '',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: threeDaysAgoStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 259200000).toLocaleString('pt-BR')
      },
      {
        id: 'T-SRM591',
        pessoaEmail: 'sharath.m@ab-inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'BrewDat',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63817?created=true',
        status: 'Cancelado',
        employeeId: '',
        dataAbertura: threeDaysAgoStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 259200000).toLocaleString('pt-BR')
      },
      {
        id: 'T-SRM592',
        pessoaEmail: 'sharath.m@ab-inbev.com',
        requireSystem: 'AD Group - Unity Catalog',
        role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ADMIN',
        equipe: 'BrewDat',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63818?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: threeDaysAgoStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 259200000).toLocaleString('pt-BR')
      },
      {
        id: 'T-MST811',
        pessoaEmail: 'mike.sturwold@labatt.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63973?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-MST812',
        pessoaEmail: 'mike.sturwold@labatt.com',
        requireSystem: 'AD Group - Unity Catalog',
        role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ADMIN',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63979?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-MST813',
        pessoaEmail: 'mike.sturwold@labatt.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63986?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-MST814',
        pessoaEmail: 'mike.sturwold@labatt.com',
        requireSystem: 'Azure DevOps',
        role: '',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63972?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-RDM051',
        pessoaEmail: 'ramdas.murali@anheuser-busch.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_ADMIN_AMERICA',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64099?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-RDM052',
        pessoaEmail: 'ramdas.murali@anheuser-busch.com',
        requireSystem: 'AD Group - Unity Catalog',
        role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ADMIN',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63975?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-RDM053',
        pessoaEmail: 'ramdas.murali@anheuser-busch.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63983?created=true',
        status: 'Cancelado',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-RDM054',
        pessoaEmail: 'ramdas.murali@anheuser-busch.com',
        requireSystem: 'Azure DevOps',
        role: '',
        equipe: 'Databricks',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63988?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-CON832',
        pessoaEmail: 'carla.oliveiranascimento@ab-inbev.com',
        requireSystem: 'AD Group - Unity Catalog',
        role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ENGINEER',
        equipe: 'Martech',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64100?created=true',
        status: 'Concluído',
        employeeId: '99840022',
        dataAbertura: threeDaysAgoStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 259200000).toLocaleString('pt-BR')
      },
      {
        id: 'T-BBZ104',
        pessoaEmail: 'bruno.braziel@ab-inbev.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: 'BrewDat',
        url: '',
        status: 'Concluído',
        employeeId: '99843048',
        dataAbertura: threeDaysAgoStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 259200000).toLocaleString('pt-BR')
      },
      {
        id: 'T-BBZ105',
        pessoaEmail: 'bruno.braziel@ab-inbev.com',
        requireSystem: 'Azure DevOps',
        role: '',
        equipe: 'BrewDat',
        url: '',
        status: 'Concluído',
        employeeId: '99843048',
        dataAbertura: threeDaysAgoStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 259200000).toLocaleString('pt-BR')
      },
      {
        id: 'T-PTG301',
        pessoaEmail: 'Pranav.Tyagi@ab-inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_AMERICA',
        equipe: '',
        url: '',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: today,
        prioridade: 'normal',
        dataInclusao: new Date().toLocaleString('pt-BR')
      },
      {
        id: 'T-PTG302',
        pessoaEmail: 'Pranav.Tyagi@ab-inbev.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: '',
        url: '',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: today,
        prioridade: 'normal',
        dataInclusao: new Date().toLocaleString('pt-BR')
      },
      {
        id: 'T-PTG303',
        pessoaEmail: 'Pranav.Tyagi@ab-inbev.com',
        requireSystem: 'Azure DevOps',
        role: '',
        equipe: '',
        url: '',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: today,
        prioridade: 'normal',
        dataInclusao: new Date().toLocaleString('pt-BR')
      },
      {
        id: 'T-PTG304',
        pessoaEmail: 'Pranav.Tyagi@ab-inbev.com',
        requireSystem: 'AD Group - Unity Catalog',
        role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ENGINEER',
        equipe: '',
        url: '',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: today,
        prioridade: 'normal',
        dataInclusao: new Date().toLocaleString('pt-BR')
      },
      {
        id: 'T-BGC841',
        pessoaEmail: 'brady.giacopelli@anheuser-busch.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_AMERICA',
        equipe: '',
        url: '',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: today,
        prioridade: 'normal',
        dataInclusao: new Date().toLocaleString('pt-BR')
      },
      {
        id: 'T-BGC842',
        pessoaEmail: 'brady.giacopelli@anheuser-busch.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: '',
        url: '',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: today,
        prioridade: 'normal',
        dataInclusao: new Date().toLocaleString('pt-BR')
      },
      {
        id: 'T-BGC843',
        pessoaEmail: 'brady.giacopelli@anheuser-busch.com',
        requireSystem: 'Azure DevOps',
        role: '',
        equipe: '',
        url: '',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: today,
        prioridade: 'normal',
        dataInclusao: new Date().toLocaleString('pt-BR')
      },
      {
        id: 'T-BGC844',
        pessoaEmail: 'brady.giacopelli@anheuser-busch.com',
        requireSystem: 'AD Group - Unity Catalog',
        role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ENGINEER',
        equipe: '',
        url: '',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: today,
        prioridade: 'normal',
        dataInclusao: new Date().toLocaleString('pt-BR')
      },
      {
        id: 'T-BBZ106',
        pessoaEmail: 'bruno.braziel@ab-inbev.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement)',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63989?created=true',
        status: 'Cancelado',
        employeeId: '99843048',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-RDM055',
        pessoaEmail: 'ramdas.murali@anheuser-busch.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63974?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-MST815',
        pessoaEmail: 'mike.sturwold@labatt.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-63973?created=true',
        status: 'Concluído',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-BBZ107',
        pessoaEmail: 'bruno.braziel@ab-inbev.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: '',
        url: '',
        status: 'Aberto',
        employeeId: '99843048',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JIR001',
        pessoaEmail: 'Pranav.Tyagi@ab-inbev.com',
        requireSystem: 'Azure DevOps',
        role: '',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64781?created=true',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JIR002',
        pessoaEmail: 'Pranav.Tyagi@ab-inbev.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64784?created=true',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JIR003',
        pessoaEmail: 'brady.giacopelli@anheuser-busch.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64785?created=true',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JIR004',
        pessoaEmail: 'ramdas.murali@anheuser-busch.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64787?created=true',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JIR005',
        pessoaEmail: 'mike.sturwold@labatt.com',
        requireSystem: 'Confluence Guest',
        role: 'Confluence  Guest(Martech Data & Measurement pages)',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64788?created=true',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JIR006',
        pessoaEmail: 'Pranav.Tyagi@ab-inbev.com',
        requireSystem: 'AD Group - Unity Catalog',
        role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ENGINEER',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64812?created=true',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JIR007',
        pessoaEmail: 'Pranav.Tyagi@ab-inbev.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_AMERICA',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64816?created=true',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JIR008',
        pessoaEmail: 'brady.giacopelli@anheuser-busch.com',
        requireSystem: 'AD Group - Unity Catalog',
        role: 'AADS_A_BEES_UC_CONSUMER_MARKETING_ENGINEER',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64813?created=true',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      },
      {
        id: 'T-JIR009',
        pessoaEmail: 'brady.giacopelli@anheuser-busch.com',
        requireSystem: 'Azure AD (BEES Tenant)',
        role: 'AADS_A_BEES_CONSUMER_MARKETING_AMERICA',
        equipe: '',
        url: 'https://ab-inbev.atlassian.net/servicedesk/customer/portal/1380/BEESFIAM-64817?created=true',
        status: 'Aberto',
        employeeId: '',
        dataAbertura: yesterdayStr,
        prioridade: 'normal',
        dataInclusao: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
      }
    ];

    saveAndSyncTickets(sampleDemoTickets);
    showToast('Base de dados limpa e populada com os dados reais Martech solicitados!', 'success', 'BANCO DE DADOS POPULADO');
  };

  // Add or Edit save ticket action
  const handleSaveTicket = (ticketData: Partial<Ticket> | Partial<Ticket>[]) => {
    if (Array.isArray(ticketData)) {
      // BULK REATION (Acesso Full) -> generate brand new ID for each situation
      const newTickets: Ticket[] = ticketData.map((ticket, index) => {
        const assignedId = `T-FL${index + 1}` + Math.random().toString(36).substr(2, 5).toUpperCase();
        return {
          id: assignedId,
          pessoaEmail: ticket.pessoaEmail || '',
          requireSystem: ticket.requireSystem || '',
          role: ticket.role || '',
          equipe: ticket.equipe || '',
          url: ticket.url || '',
          status: ticket.status || 'Aberto',
          employeeId: ticket.employeeId || '',
          dataAbertura: ticket.dataAbertura || '',
          prioridade: ticket.prioridade || 'normal',
          dataInclusao: ticket.dataInclusao || new Date().toLocaleString('pt-BR')
        };
      });

      const updatedList = [...newTickets, ...tickets];
      saveAndSyncTickets(updatedList);
      // Automatically redirect to the sheet list to see updated results
      setActiveTab('sheet');
      showToast(`${newTickets.length} chamados do pacote "Acesso Full" registrados com sucesso na planilha integrada!`, 'success', 'ACESSO FULL LANÇADO');
    } else {
      if (ticketData.id) {
        // EDIT OPERATION -> update existing
        const updatedList = tickets.map(t => t.id === ticketData.id ? { ...t, ...ticketData } as Ticket : t);
        saveAndSyncTickets(updatedList);
        setTicketToEdit(null);
        // Automatically redirect to the sheet list to see updated results
        setActiveTab('sheet');
        showToast(`O registro #${ticketData.id} foi atualizado com sucesso na planilha integrada!`, 'success', 'REGISTRO ATUALIZADO');
      } else {
        // CREATE OPERATION -> generate brand new ID
        const assignedId = 'T-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const newTicket: Ticket = {
          id: assignedId,
          pessoaEmail: ticketData.pessoaEmail || '',
          requireSystem: ticketData.requireSystem || '',
          role: ticketData.role || '',
          equipe: ticketData.equipe || '',
          url: ticketData.url || '',
          status: ticketData.status || 'Aberto',
          employeeId: ticketData.employeeId || '',
          dataAbertura: ticketData.dataAbertura || '',
          prioridade: ticketData.prioridade || 'normal',
          dataInclusao: ticketData.dataInclusao || new Date().toLocaleString('pt-BR'),
          
          // Form 2.0 optional fields
          resumo: ticketData.resumo,
          managerEmail: ticketData.managerEmail,
          justificativa: ticketData.justificativa,
          zona: ticketData.zona,
          anexoNome: ticketData.anexoNome
        };
        
        const updatedList = [newTicket, ...tickets];
        saveAndSyncTickets(updatedList);
        // Auto redirect to sheet database to review created spreadsheet row
        setActiveTab('sheet');
        showToast(`Novo chamado ${assignedId} cadastrado e inserido na planilha com sucesso!`, 'success', 'CHAMADO LANÇADO');
      }
    }
  };

  // Triggering edit state on clicked grid item
  const handleEditTrigger = (ticket: Ticket) => {
    setTicketToEdit(ticket);
    if (ticket.resumo || ticket.managerEmail || ticket.justificativa || ticket.zona) {
      setActiveTab('form2');
    } else {
      setActiveTab('form');
    }
  };

  const handleCancelEdit = () => {
    setTicketToEdit(null);
  };

  const handleDeleteTicket = (id: string) => {
    const updatedList = tickets.filter(t => t.id !== id);
    saveAndSyncTickets(updatedList);
    // If deleted ticket was being edited, cancel edit modes
    if (ticketToEdit?.id === id) {
      setTicketToEdit(null);
    }
    showToast(`O registro #${id} foi removido com sucesso da planilha de dados!`, 'warning', 'REMOVIDO COM SUCESSO');
  };

  const handleClearAll = () => {
    saveAndSyncTickets([]);
    setTicketToEdit(null);
    showToast('Toda a base de dados da planilha foi limpa e zerada!', 'error', 'BASE LIMPA');
  };

  const handleImportTickets = (importedList: Ticket[], replace = false) => {
    // Append or replace? Let's append newly imported lines in front or completely replace if replace=true
    const updated = replace ? importedList : [...importedList, ...tickets];
    saveAndSyncTickets(updated);
    if (!replace) {
      showToast(`${importedList.length} registros foram importados do arquivo CSV para a planilha com sucesso!`, 'success', 'IMPORTAÇÃO PLANILHA');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 selection:bg-amber-200" id="main-applet">
      
      {/* Top Professional Portal Bar */}
      <header className="bg-slate-950 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 px-3.5 py-2 rounded-xl font-black text-base tracking-widest flex items-center justify-center shadow-lg shadow-amber-500/20">
              ABI
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight sm:text-lg flex items-center gap-1.5 leading-none text-slate-50">
                Gestão & Lançador de Chamados
              </h1>
              <p className="text-[10px] text-slate-400 mt-1 font-bold tracking-wide uppercase">Hub Corporativo Martech Utilities</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full text-emerald-400 font-bold flex items-center gap-2 shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              Conexão Planilha Sincronizada
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tab selection - Segmented Control design */}
        <div className="bg-slate-100 p-1.5 rounded-2xl max-w-3xl mx-auto border border-slate-200/60 shadow-xs" id="navigation-tabs">
          <div className="flex flex-col sm:flex-row gap-1 w-full">
            
            {/* Form tab button */}
            <button
              onClick={() => {
                setActiveTab('form');
                if (ticketToEdit) setTicketToEdit(null); // Clear any editing state when starting a fresh launch
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-250 cursor-pointer ${
                activeTab === 'form' 
                  ? 'bg-white text-amber-600 shadow-xs focus:outline-none' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <PlusCircle className={`h-4 w-4 ${activeTab === 'form' ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`} />
              <span>{ticketToEdit && activeTab === 'form' ? 'Editar Registro' : 'Lancar (Form 1.0)'}</span>
            </button>

            {/* Form 2.0 tab button */}
            <button
              onClick={() => {
                setActiveTab('form2');
                if (ticketToEdit) setTicketToEdit(null); // Clear any editing state when starting a fresh launch
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all duration-250 cursor-pointer ${
                activeTab === 'form2' 
                  ? 'bg-white text-blue-600 shadow-xs focus:outline-none' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
              title="Formulário 2.0 - Clone perfeito do Atlassian Jira Service Desk 7022"
            >
              <Zap className={`h-4 w-4 ${activeTab === 'form2' ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
              <span>Chamado 2.0</span>
              <span className="text-[9px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-black uppercase shrink-0 scale-90">Jira</span>
            </button>

            {/* Sheet database tab button */}
            <button
              id="sheet-tab-trigger"
              onClick={() => setActiveTab('sheet')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-250 cursor-pointer ${
                activeTab === 'sheet' 
                  ? 'bg-white text-amber-600 shadow-xs focus:outline-none' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <Database className={`h-4 w-4 ${activeTab === 'sheet' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Ver Planilha</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ml-1 transition-all ${
                activeTab === 'sheet' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {tickets.length}
              </span>
            </button>

            {/* Dashboard metrics button */}
            <button
              onClick={() => setActiveTab('dash')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-250 cursor-pointer ${
                activeTab === 'dash' 
                  ? 'bg-white text-amber-600 shadow-xs focus:outline-none' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <BarChart3 className={`h-4 w-4 ${activeTab === 'dash' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Gestão Visual</span>
            </button>

          </div>
        </div>

        {/* Dynamic Display Rendering */}
        <div className="transition-all duration-300">
          
          {/* TAB 1: FORM */}
          {activeTab === 'form' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {ticketToEdit && (
                <div className="bg-amber-50/80 backdrop-blur-md border-2 border-amber-200/75 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-amber-900 block">Modo de Edição Ativo</span>
                      <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                        Ajuste os dados de #{ticketToEdit.id} e clique em "Atualizar na Planilha" para persistir as alterações.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCancelEdit} 
                    className="w-full sm:w-auto text-xs bg-amber-600 hover:bg-amber-700 text-white font-black py-2 px-4 rounded-xl cursor-pointer shadow-xs transition duration-150"
                  >
                    Encerrar Edição
                  </button>
                </div>
              )}
              <TicketForm 
                onSave={handleSaveTicket} 
                ticketToEdit={ticketToEdit}
                onCancelEdit={handleCancelEdit}
                showToast={showToast}
              />
            </div>
          )}

          {/* TAB 1.5: FORM 2.0 (JIRA CLONE) */}
          {activeTab === 'form2' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {ticketToEdit && (
                <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-100 text-[#0052CC] rounded-lg">
                      <AlertCircle className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-[#0747A6] block">Modo de Edição 2.0</span>
                      <p className="text-[11px] text-sky-850 font-semibold mt-0.5">
                        Ajustando os dados do chamado de #{ticketToEdit.id} em tempo real.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCancelEdit} 
                    className="w-full sm:w-auto text-xs bg-[#0052CC] hover:bg-[#0747A6] text-white font-extrabold py-2 px-4 rounded-lg cursor-pointer shadow-3xs transition"
                  >
                    Encerrar Edição
                  </button>
                </div>
              )}
              <TicketForm2 
                onSave={handleSaveTicket} 
                ticketToEdit={ticketToEdit}
                onCancelEdit={handleCancelEdit}
                showToast={showToast}
              />
            </div>
          )}

          {/* TAB 2: SHEET DATABASE */}
          {activeTab === 'sheet' && (
            <div className="space-y-4">
              <SheetDatabase 
                tickets={tickets} 
                onEdit={handleEditTrigger} 
                onDelete={handleDeleteTicket}
                onClearAll={handleClearAll}
                onImportTickets={handleImportTickets}
                onLoadSeedData={loadSampleDemoData}
                showToast={showToast}
              />
            </div>
          )}

          {/* TAB 3: VISUAL GRAPHICS METRICS */}
          {activeTab === 'dash' && (
            <div>
              <Dashboard tickets={tickets} />
            </div>
          )}

        </div>

      </main>

      {/* Small informative Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 mt-20 text-center text-xs font-semibold">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="text-slate-100">© 2026 Portal de Controle & Planilha Integrada ABI Inc. Todos os direitos reservados.</p>
          <p className="text-slate-500 font-mono text-[10px]">Autenticação & Controle de Conformidade com AD / Confluence & Azure Tenants.</p>
        </div>
      </footer>

      {/* Global action response Toast Feedback Overlay */}
      <ToastNotification 
        toasts={toasts} 
        onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} 
      />

    </div>
  );
}
