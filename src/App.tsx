import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './features/dashboard/DashboardView';
import { TurnosView } from './features/turnos/TurnosView';
import { ClientesView } from './features/clientes/ClientesView';
import { WhatsAppView } from './features/whatsapp/WhatsAppView';
import { RedesView } from './features/redes/RedesView';

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'turnos':
        return <TurnosView setActiveTab={setActiveTab} />;
      case 'clientes':
        return <ClientesView setActiveTab={setActiveTab} />;
      case 'whatsapp':
        return <WhatsAppView />;
      case 'redes':
        return <RedesView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-600 font-sans">
      {/* Sidebar Fijo (w-64) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Área de Contenido Principal (Margen de 64 para no solaparse con el Sidebar) */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header Superior Sticky */}
        <Header activeTab={activeTab} />

        {/* Contenido Central Scrollable */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
