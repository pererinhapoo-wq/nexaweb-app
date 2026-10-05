import React, { useState, useEffect } from 'react';
import { ViewTab, Lead, LeadStatus } from './types';
import { getStoredLeads, getStoredLeadsNative, saveStoredLeads } from './utils/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { FindClientsScreen } from './components/FindClientsScreen';
import { MyLeadsScreen } from './components/MyLeadsScreen';
import { PortfolioScreen } from './components/PortfolioScreen';
import { LeadDetailModal } from './components/LeadDetailModal';
import { LeadFormModal } from './components/LeadFormModal';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [leads, setLeads] = useState<Lead[]>(() => getStoredLeads());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [preFillLocation, setPreFillLocation] = useState<{
    cidade: string;
    segmento: string;
  } | null>(null);

  // Inicialização nativa segura (Status Bar, Splash Screen e Reconciliação do Storage Nativo)
  useEffect(() => {
    async function initNativePlatform() {
      try {
        // Carrega leads da persistência nativa se houver dados
        const nativeLeads = await getStoredLeadsNative();
        if (nativeLeads && nativeLeads.length > 0) {
          setLeads(nativeLeads);
        }
      } catch (err) {
        console.warn('Persistência nativa não disponível:', err);
      }

      try {
        // Configura a barra de status do Android com a cor escura slate-950 (#020617)
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#020617' });
      } catch {
        // Ignorado no navegador web
      }

      try {
        // Oculta a tela de splash nativa após o carregamento
        await SplashScreen.hide();
      } catch {
        // Ignorado no navegador web
      }
    }

    initNativePlatform();
  }, []);

  // Sync to storage whenever leads changes
  useEffect(() => {
    saveStoredLeads(leads);
  }, [leads]);

  // Keep selectedLead in sync with leads list
  useEffect(() => {
    if (selectedLead) {
      const updated = leads.find((l) => l.id === selectedLead.id);
      if (updated) {
        setSelectedLead(updated);
      }
    }
  }, [leads]);

  // Handlers
  const handleSaveLead = (leadToSave: Lead) => {
    setLeads((prev) => {
      const existsIndex = prev.findIndex((l) => l.id === leadToSave.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = leadToSave;
        return next;
      }
      return [leadToSave, ...prev];
    });
    setEditingLead(null);
  };

  const handleUpdateStatus = (id: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              status: newStatus,
              dataAtualizacao: new Date().toISOString(),
            }
          : lead
      )
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              observacoes: notes,
              dataAtualizacao: new Date().toISOString(),
            }
          : lead
      )
    );
  };

  const handleUpdateMessage = (id: string, message: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              mensagemAbordagem: message,
              dataAtualizacao: new Date().toISOString(),
            }
          : lead
      )
    );
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    if (selectedLead?.id === id) {
      setSelectedLead(null);
    }
  };

  const handleOpenNewLeadModal = () => {
    setEditingLead(null);
    setPreFillLocation(null);
    setIsFormModalOpen(true);
  };

  const handlePreFillLead = (cidade: string, segmento: string) => {
    setEditingLead(null);
    setPreFillLocation({ cidade, segmento });
    setIsFormModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        leadCount={leads.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 sm:py-6">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigate={setCurrentTab}
            leads={leads}
            onOpenNewLeadModal={handleOpenNewLeadModal}
          />
        )}

        {currentTab === 'find' && (
          <FindClientsScreen onPreFillLead={handlePreFillLead} />
        )}

        {currentTab === 'leads' && (
          <MyLeadsScreen
            leads={leads}
            onSelectLead={setSelectedLead}
            onOpenNewLeadModal={handleOpenNewLeadModal}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {currentTab === 'portfolio' && <PortfolioScreen />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        leadCount={leads.length}
      />

      {/* Modal Detalhes do Lead */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateNotes={handleUpdateNotes}
        onUpdateMessage={handleUpdateMessage}
        onEditLead={handleEditLead}
        onDeleteLead={handleDeleteLead}
      />

      {/* Modal Formulário do Lead (Criar / Editar) */}
      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingLead(null);
          setPreFillLocation(null);
        }}
        onSave={handleSaveLead}
        initialLead={editingLead}
        defaultCidade={preFillLocation?.cidade}
        defaultSegmento={preFillLocation?.segmento}
      />
    </div>
  );
}
