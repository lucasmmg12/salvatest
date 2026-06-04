import React from 'react';
import { Calendar, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Vista General y Métricas';
      case 'turnos':
        return 'Agenda de Turnos';
      case 'clientes':
        return 'Legajos de Clientes';
      case 'whatsapp':
        return 'Centro de Mensajería WhatsApp';
      case 'redes':
        return 'Planificación de Contenido Redes';
      default:
        return 'Panel de Control';
    }
  };

  const getTodayDateString = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('es-AR', options);
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-6 py-4 flex items-center justify-between">
      {/* Sección Izquierda: Título Dinámico */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-gray-800 tracking-tight">
          {getTabTitle(activeTab)}
        </h1>
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200/50 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span>Sincronizado</span>
        </div>
      </div>

      {/* Sección Derecha: Info de Usuario / Fecha */}
      <div className="flex items-center gap-4">
        {/* Fecha Actual */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Calendar size={14} className="text-gray-400" />
          <span className="capitalize">{getTodayDateString()}</span>
        </div>

        <div className="h-4 w-[1px] bg-gray-200 hidden md:block"></div>

        {/* Perfil del Administrador */}
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-gray-800 leading-tight">Lucas Administrador</span>
            <span className="text-[10px] text-gray-400 font-bold flex items-center justify-end gap-0.5">
              <ShieldCheck size={10} className="text-ecar-blue" />
              ECAR Estética
            </span>
          </div>
          {/* Avatar Circles (Iniciales) */}
          <div className="w-8 h-8 rounded-full bg-ecar-blue/10 flex items-center justify-center text-ecar-blue font-black text-xs ring-2 ring-ecar-blue/10">
            LA
          </div>
        </div>
      </div>
    </header>
  );
};
