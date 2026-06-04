import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  FileText, 
  Clock, 
  Phone, 
  User,
  Sparkles,
  ChevronRight,
  CheckCheck
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const WhatsAppView: React.FC = () => {
  const { chats, activeChatId, sendMensaje, setActiveChat, clientes } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Auto-scroll al final del chat cuando hay nuevos mensajes o cambia de chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.mensajes, isTyping]);

  // Simulación de "Escribiendo..." cuando enviamos un mensaje
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    sendMensaje(activeChatId, inputText);
    setInputText('');

    // Prender "Escribiendo..." a los 1.5s y apagar a los 4s (cuando entra el mensaje simulado)
    setTimeout(() => {
      setIsTyping(true);
    }, 1200);

    setTimeout(() => {
      setIsTyping(false);
    }, 3900);
  };

  const handleApplyTemplate = (templateText: string) => {
    if (!activeChatId) return;
    
    // Buscar si hay un turno para este cliente para rellenar variables
    const state = useStore.getState();
    const clienteId = activeChat?.clienteId;
    const turnoCliente = state.turnos.find(t => t.clienteId === clienteId && t.estado !== 'Cancelado');

    let text = templateText;
    if (activeChat) {
      text = text.replace('{nombre}', activeChat.clienteNombre);
    }
    if (turnoCliente) {
      text = text.replace('{servicio}', turnoCliente.servicio)
                 .replace('{fecha}', turnoCliente.fecha)
                 .replace('{hora}', turnoCliente.hora);
    } else {
      text = text.replace('{servicio}', 'tu servicio')
                 .replace('{fecha}', 'la fecha agendada')
                 .replace('{hora}', 'la hora acordada');
    }

    setInputText(text);
  };

  // Filtrado de chats en el sidebar lateral
  const filteredChats = chats.filter(c => 
    c.clienteNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.ultimoMensaje.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const templates = [
    {
      label: 'Recordatorio Turno',
      text: 'Hola {nombre}! Te recordamos tu turno para el día {fecha} a las {hora} hs para {servicio}. ¿Nos confirmás asistencia? ¡Te esperamos! ✨'
    },
    {
      label: 'Confirmación Turno',
      text: '¡Hola {nombre}! Confirmamos tu turno de {servicio} para el día {fecha} a las {hora} hs. ¡Muchas gracias!'
    },
    {
      label: 'Promo Mes',
      text: '¡Hola {nombre}! 🌸 Queremos contarte que este mes tenemos un 15% off en tratamientos faciales. ¿Te gustaría reservar un lugar?'
    },
    {
      label: 'Agradecimiento',
      text: '¡Gracias por visitarnos hoy, {nombre}! Esperamos que hayas disfrutado tu sesión de {servicio}. Contanos qué te pareció.'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex h-[calc(100vh-140px)]">
      {/* 1. Panel Izquierdo: Lista de Chats */}
      <div className="w-80 border-r border-gray-200 flex flex-col h-full bg-gray-50/50">
        {/* Cabecera del buscador */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Buscar chat o mensaje..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-ecar-blue bg-gray-50"
            />
          </div>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 no-scrollbar">
          {filteredChats.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">No se encontraron chats</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                    isActive ? 'bg-blue-50/70 border-l-4 border-ecar-blue' : 'hover:bg-gray-100/50'
                  }`}
                >
                  {/* Avatar inicial */}
                  <div className="w-9 h-9 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-700 font-bold text-xs">
                    {chat.clienteNombre[0].toUpperCase()}
                  </div>

                  {/* Cuerpo del chat item */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-bold text-xs text-gray-800 truncate">{chat.clienteNombre}</h4>
                      <span className="text-[9px] text-gray-400 font-mono font-bold">{chat.fechaUltimoMensaje}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate pr-4">
                      {chat.ultimoMensaje}
                    </p>
                  </div>

                  {/* Globo no leídos */}
                  {chat.noLeidos > 0 && (
                    <span className="bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">
                      {chat.noLeidos}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Panel Derecho: Ventana de Chat Activo */}
      <div className="flex-1 flex flex-col h-full bg-gray-50 relative">
        {activeChat ? (
          <>
            {/* Cabecera del chat */}
            <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-sm">
                  {activeChat.clienteNombre[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800">{activeChat.clienteNombre}</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-gray-400 font-bold font-mono">{activeChat.clienteTelefono}</span>
                  </div>
                </div>
              </div>

              {/* Botón ver ficha */}
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-lg bg-green-50 border border-green-200/50 flex items-center gap-1.5 text-[10px] font-bold text-green-700">
                  <Phone size={12} />
                  <span>WhatsApp En Línea</span>
                </div>
              </div>
            </div>

            {/* Historial de Mensajes */}
            <div 
              className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#f8f9fa] no-scrollbar"
              style={{
                backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                backgroundOpacity: 0.05
              }}
            >
              {activeChat.mensajes.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-white/80 p-6 rounded-xl max-w-sm mx-auto shadow-sm border border-gray-100">
                  <Sparkles size={32} className="mx-auto mb-2 text-ecar-blue" />
                  <p className="text-xs font-bold text-gray-700">No hay mensajes previos</p>
                  <p className="text-[11px] mt-1">Escribí tu primer mensaje o aplicá una de las plantillas rápidas de abajo.</p>
                </div>
              ) : (
                activeChat.mensajes.map((msg) => {
                  const isMe = msg.sender === 'nosotros';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-xl px-4 py-2.5 shadow-sm text-xs relative ${
                        isMe 
                          ? 'bg-ecar-blue text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                      }`}>
                        <p className="leading-relaxed">{msg.texto}</p>
                        
                        <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-bold ${
                          isMe ? 'text-blue-200' : 'text-gray-400'
                        }`}>
                          <span>{msg.fecha}</span>
                          {isMe && <CheckCheck size={12} className="text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Animación "Escribiendo..." */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-500 rounded-xl rounded-tl-none px-4 py-3 border border-gray-200 shadow-sm text-xs flex items-center gap-1.5">
                    <span className="font-bold text-[10px] italic">Escribiendo</span>
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sección de Plantillas Rápidas */}
            <div className="bg-white px-6 py-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 flex-shrink-0">
                <FileText size={12} /> Plantillas:
              </span>
              <div className="flex gap-1.5">
                {templates.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplyTemplate(tpl.text)}
                    className="text-[10px] font-bold bg-gray-100 hover:bg-ecar-blue hover:text-white text-gray-600 px-2.5 py-1 rounded-full border border-gray-200 transition-all flex-shrink-0"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor de entrada del chat */}
            <form 
              onSubmit={handleSendMessage}
              className="bg-white px-6 py-3 border-t border-gray-200 flex items-center gap-3"
            >
              <input
                type="text"
                placeholder="Escribí un mensaje de WhatsApp..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ecar-blue/30 focus:border-ecar-blue transition-all"
              />
              <button
                type="submit"
                className="bg-ecar-blue text-white p-2 rounded-xl hover:bg-ecar-blueDark transition-colors shadow-sm"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <MessageSquare size={48} className="opacity-20 text-ecar-blue mb-3" />
            <p className="font-bold text-sm text-gray-700">Comenzá una conversación</p>
            <p className="text-xs text-center max-w-xs mt-1">
              Seleccioná un chat del menú lateral o iniciá una charla directa desde los legajos de clientes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
