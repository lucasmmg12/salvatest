import React from 'react';
import { 
  LayoutGrid, 
  Calendar, 
  Users, 
  MessageSquare, 
  Share2, 
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const chats = useStore((state) => state.chats);
  const unreadMessages = chats.reduce((acc, chat) => acc + (chat.noLeidos || 0), 0);

  const menuItems = [
    {
      group: 'Gestión Operativa',
      items: [
        { id: 'dashboard', label: 'Vista General', icon: LayoutGrid },
        { id: 'turnos', label: 'Agenda y Turnos', icon: Calendar },
        { id: 'clientes', label: 'Legajos Clientes', icon: Users },
      ]
    },
    {
      group: 'Comunicación y Marketing',
      items: [
        { 
          id: 'whatsapp', 
          label: 'WhatsApp Chat', 
          icon: MessageSquare,
          badge: unreadMessages > 0 ? unreadMessages : undefined
        },
        { id: 'redes', label: 'Planificador Redes', icon: Share2 },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-ecar-blueDark text-blue-100 flex flex-col border-r border-[#08355e] h-screen fixed top-0 left-0 z-20">
      {/* Panel Superior Logo */}
      <div className="p-6 bg-white border-b border-gray-200 flex items-center justify-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-ecar-blue flex items-center justify-center shadow-md animate-pulse">
          <Sparkles className="text-white" size={18} />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-gray-900 tracking-tight leading-none text-sm uppercase">
            ECAR Estética
          </span>
          <span className="text-[10px] text-gray-500 font-bold tracking-wider mt-0.5">
            BIENESTAR Y SALUD
          </span>
        </div>
      </div>

      {/* Navegación Principal */}
      <div className="flex-1 py-6 overflow-y-auto px-4 space-y-7 no-scrollbar">
        {menuItems.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-2">
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-blue-300/40">
              {group.group}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-white/10 text-white ring-1 ring-white/20'
                        : 'text-blue-100 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={18} className={isActive ? 'text-white' : 'text-blue-300'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="bg-ecar-red text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-white/5 bg-[#073055] text-center">
        <span className="text-[9px] font-bold tracking-widest text-blue-200/30 uppercase block">
          SISTEMA CREADO POR GROW LABS
        </span>
        <span className="text-[8px] text-blue-200/20 font-mono mt-0.5 block">
          v1.4.0 • ERP INTEGRADO
        </span>
      </div>
    </aside>
  );
};
