import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  DollarSign, 
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const { clientes, turnos, posts, chats, updateTurnoEstado } = useStore();

  const hoy = new Date().toISOString().split('T')[0];

  // Métricas
  const turnosHoy = turnos.filter(t => t.fecha === hoy);
  const totalClientes = clientes.length;
  
  const ingresosHoy = turnosHoy
    .filter(t => t.estado === 'Confirmado' || t.estado === 'Realizado')
    .reduce((acc, t) => acc + t.precio, 0);

  const chatsSinLeer = chats.reduce((acc, c) => acc + (c.noLeidos || 0), 0);

  // Turnos próximos
  const proximosTurnos = [...turnosHoy]
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .slice(0, 5);

  // Redes sociales próximas
  const postsProgramados = posts
    .filter(p => p.estado === 'Programado' || p.estado === 'Borrador')
    .slice(0, 3);

  // WhatsApp urgentes
  const chatsUrgentes = chats
    .filter(c => c.noLeidos > 0)
    .slice(0, 3);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Confirmado':
        return <span className="badge-success">Confirmado</span>;
      case 'Pendiente':
        return <span className="badge-pending">Pendiente</span>;
      case 'Realizado':
        return <span className="badge-info">Realizado</span>;
      case 'Cancelado':
        return <span className="badge-danger">Cancelado</span>;
      default:
        return <span className="badge-gray">{estado}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header de Módulo (Gradient Banner) */}
      <div className="bg-gradient-to-r from-ecar-blueDark to-ecar-blue rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <Sparkles size={24} /> ¡Hola, Lucas!
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            Te damos la bienvenida al panel de control de tu estética. Así marcha la actividad del día.
          </p>
        </div>
      </div>

      {/* 2. KPI Cards (Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Turnos de Hoy */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <Calendar size={16} className="text-yellow-600" /> Turnos de Hoy
          </div>
          <p className="text-2xl font-black text-gray-800 font-mono">
            {turnosHoy.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {turnosHoy.filter(t => t.estado === 'Pendiente').length} pendientes de confirmar
          </p>
        </div>

        {/* KPI: Clientes Activos */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <Users size={16} className="text-indigo-600" /> Clientes Registrados
          </div>
          <p className="text-2xl font-black text-gray-800 font-mono">
            {totalClientes}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            En la base de datos de legajos
          </p>
        </div>

        {/* KPI: Ingresos de Hoy */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <DollarSign size={16} className="text-emerald-600" /> Ingresos de Hoy
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            $ {ingresosHoy.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            De turnos confirmados/realizados
          </p>
        </div>

        {/* KPI: WhatsApp Chats */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <MessageSquare size={16} className="text-ecar-blue" /> WhatsApp Sin Leer
          </div>
          <p className={`text-2xl font-black font-mono ${chatsSinLeer > 0 ? 'text-ecar-red' : 'text-gray-800'}`}>
            {chatsSinLeer}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Chats pendientes de respuesta
          </p>
        </div>
      </div>

      {/* Grid Secundario: Contenido Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda/Centro: Próximos Turnos (Hoy) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                <Clock size={16} className="text-ecar-blue" />
                Turnos Programados para Hoy
              </h3>
              <button 
                onClick={() => setActiveTab('turnos')}
                className="text-xs font-bold text-ecar-blue hover:text-ecar-blueDark flex items-center gap-1 transition-colors"
              >
                Ver agenda completa
                <ArrowUpRight size={14} />
              </button>
            </div>
            
            {proximosTurnos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Calendar size={40} className="mx-auto mb-3 opacity-30 text-gray-400" />
                <p className="font-medium text-sm">No hay turnos para hoy</p>
                <p className="text-xs mt-1">Podés agendar uno nuevo desde la sección de Agenda.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100/50 border-b text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Servicio</th>
                    <th className="px-4 py-3">Valor</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {proximosTurnos.map((turno) => (
                    <tr key={turno.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-gray-800">
                        {turno.hora}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {turno.clienteNombre}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs font-medium">
                        {turno.servicio}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-gray-800 text-xs">
                        $ {turno.precio.toLocaleString('es-AR')}
                      </td>
                      <td className="px-4 py-3">
                        {getEstadoBadge(turno.estado)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {turno.estado === 'Pendiente' && (
                          <button
                            onClick={() => updateTurnoEstado(turno.id, 'Confirmado')}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-700 transition-colors"
                          >
                            Confirmar
                          </button>
                        )}
                        {turno.estado === 'Confirmado' && (
                          <button
                            onClick={() => updateTurnoEstado(turno.id, 'Realizado')}
                            className="bg-ecar-blue text-white px-2 py-1 rounded text-xs font-bold hover:bg-ecar-blueDark transition-colors"
                          >
                            Finalizar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Planificador de Redes - Vista Rápida */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-violet-600" />
                Publicaciones Programadas / Ideas
              </h3>
              <button 
                onClick={() => setActiveTab('redes')}
                className="text-xs font-bold text-ecar-blue hover:text-ecar-blueDark flex items-center gap-1 transition-colors"
              >
                Gestionar Redes
                <ArrowUpRight size={14} />
              </button>
            </div>

            {postsProgramados.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm">No hay publicaciones agendadas</p>
                <p className="text-xs mt-0.5">Planificá tus contenidos semanales para mantener activas tus redes.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {postsProgramados.map((post) => (
                  <div key={post.id} className="p-4 hover:bg-gray-50 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          post.plataforma === 'Instagram' ? 'bg-pink-100 text-pink-700' :
                          post.plataforma === 'TikTok' ? 'bg-black text-white' :
                          post.plataforma === 'Facebook' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {post.plataforma}
                        </span>
                        <span className="text-xs text-gray-400 font-bold font-mono">
                          {post.fechaPublicacion} a las {post.horaPublicacion || '12:00'}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-gray-800">{post.titulo}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{post.contenido}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      post.estado === 'Programado' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {post.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: WhatsApp Chats Pendientes */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                <MessageSquare size={16} className="text-green-600" />
                Mensajes sin responder ({chatsSinLeer})
              </h3>
              <button 
                onClick={() => setActiveTab('whatsapp')}
                className="text-xs font-bold text-ecar-blue hover:text-ecar-blueDark flex items-center gap-1 transition-colors"
              >
                Abrir chat
                <ArrowUpRight size={14} />
              </button>
            </div>

            {chatsUrgentes.length === 0 ? (
              <div className="text-center py-16 text-gray-400 px-4 flex-1 flex flex-col items-center justify-center">
                <MessageSquare size={40} className="mx-auto mb-3 opacity-30 text-green-500" />
                <p className="font-medium text-sm">¡Al día con los chats!</p>
                <p className="text-xs mt-1">No hay mensajes entrantes sin responder en este momento.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 flex-1">
                {chatsUrgentes.map((chat) => (
                  <div 
                    key={chat.id} 
                    onClick={() => {
                      useStore.getState().setActiveChat(chat.id);
                      setActiveTab('whatsapp');
                    }}
                    className="p-4 hover:bg-green-50/50 cursor-pointer transition-colors space-y-1 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-gray-800">{chat.clienteNombre}</span>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">{chat.fechaUltimoMensaje}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 pr-6">
                      {chat.ultimoMensaje}
                    </p>
                    {chat.noLeidos > 0 && (
                      <span className="absolute right-4 bottom-4 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black animate-bounce">
                        {chat.noLeidos}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
