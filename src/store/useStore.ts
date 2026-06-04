import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cliente, Turno, SocialPost, Chat, Mensaje, TurnoEstado, PostEstado, PlataformaSocial } from '../types';

interface StoreState {
  clientes: Cliente[];
  turnos: Turno[];
  posts: SocialPost[];
  chats: Chat[];
  activeChatId: string | null;
  
  // Clientes
  addCliente: (cliente: Omit<Cliente, 'id' | 'fechaRegistro'>) => Cliente;
  updateCliente: (id: string, clienteUpdates: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
  
  // Turnos
  addTurno: (turno: Omit<Turno, 'id'>) => void;
  updateTurnoEstado: (id: string, estado: TurnoEstado) => void;
  deleteTurno: (id: string) => void;
  
  // Redes Sociales
  addPost: (post: Omit<SocialPost, 'id' | 'likes' | 'compartidos'>) => void;
  updatePost: (id: string, postUpdates: Partial<SocialPost>) => void;
  deletePost: (id: string) => void;
  
  // WhatsApp
  setActiveChat: (chatId: string | null) => void;
  sendMensaje: (chatId: string, texto: string) => void;
  recibirMensajeSimulado: (chatId: string, texto: string) => void;
  marcarComoLeido: (chatId: string) => void;
  crearChat: (clienteId: string) => string;
}

const mockClientes: Cliente[] = [
  {
    id: 'c1',
    nombre: 'Valentina Rossi',
    telefono: '+54 9 11 5472-8812',
    email: 'valentina.rossi@gmail.com',
    notas: 'Piel sensible, prefiere productos hipoalergénicos.',
    fechaRegistro: '2026-03-12',
    historialServicios: ['Limpieza facial', 'Perfilado de cejas']
  },
  {
    id: 'c2',
    nombre: 'Camila Fernández',
    telefono: '+54 9 341 682-1194',
    email: 'camila.f@hotmail.com',
    notas: 'Suele hacerse manicura semipermanente color rojo o nude.',
    fechaRegistro: '2026-04-18',
    historialServicios: ['Manicura Semipermanente']
  },
  {
    id: 'c3',
    nombre: 'Sofía Martínez',
    telefono: '+54 9 261 458-7290',
    email: 'sofia.m@gmail.com',
    notas: 'Realiza tratamientos de cejas y pestañas cada 21 días.',
    fechaRegistro: '2026-05-01',
    historialServicios: ['Perfilado de cejas', 'Lifting de pestañas']
  },
  {
    id: 'c4',
    nombre: 'Lucas Galarza',
    telefono: '+54 9 11 3822-9011',
    email: 'lucas.gal@outlook.com',
    notas: 'Viene una vez al mes por masajes descontracturantes de espalda.',
    fechaRegistro: '2026-01-20',
    historialServicios: ['Masaje Descontracturante']
  },
  {
    id: 'c5',
    nombre: 'María Florencia Díaz',
    telefono: '+54 9 351 771-4433',
    email: 'mfdiaz@live.com.ar',
    notas: 'Interesada en tratamientos corporales y depilación definitiva.',
    fechaRegistro: '2026-05-15',
    historialServicios: []
  }
];

const mockTurnos: Turno[] = [
  {
    id: 't1',
    clienteId: 'c1',
    clienteNombre: 'Valentina Rossi',
    servicio: 'Limpieza facial profunda',
    fecha: new Date().toISOString().split('T')[0], // hoy
    hora: '15:30',
    estado: 'Confirmado',
    precio: 18000,
    notas: 'Usar sérum descongestivo al finalizar.'
  },
  {
    id: 't2',
    clienteId: 'c2',
    clienteNombre: 'Camila Fernández',
    servicio: 'Manicura Semipermanente',
    fecha: new Date().toISOString().split('T')[0], // hoy
    hora: '17:00',
    estado: 'Pendiente',
    precio: 12000,
    notas: 'Diseño sutil (nail art básico en dos dedos).'
  },
  {
    id: 't3',
    clienteId: 'c4',
    clienteNombre: 'Lucas Galarza',
    servicio: 'Masaje Descontracturante',
    fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0], // mañana
    hora: '10:00',
    estado: 'Confirmado',
    precio: 24000,
    notas: 'Foco en la zona lumbar y hombros.'
  },
  {
    id: 't4',
    clienteId: 'c3',
    clienteNombre: 'Sofía Martínez',
    servicio: 'Lifting de pestañas + Cejas',
    fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0], // ayer
    hora: '16:00',
    estado: 'Realizado',
    precio: 14500
  }
];

const mockPosts: SocialPost[] = [
  {
    id: 'p1',
    titulo: 'Promo Invierno Manos',
    plataforma: 'Instagram',
    estado: 'Programado',
    fechaPublicacion: new Date(Date.now() + 86400000).toISOString().split('T')[0], // mañana
    horaPublicacion: '19:00',
    contenido: '¡Llega el frío pero tus manos no sufren! ❄️💅 Disfrutá de un 20% off de martes a jueves en tu servicio de Manicura Semipermanente. Reservá tu turno escribiéndonos por WhatsApp o MD. ¡Te esperamos!',
    likes: 0,
    compartidos: 0
  },
  {
    id: 'p2',
    titulo: 'Paso a paso Skin Care',
    plataforma: 'TikTok',
    estado: 'Publicado',
    fechaPublicacion: new Date(Date.now() - 172800000).toISOString().split('T')[0], // hace 2 días
    horaPublicacion: '15:00',
    contenido: '¿Cómo cuidamos tu piel en nuestro gabinete facial?💆‍♀️✨ Mirá el paso a paso de nuestra Limpieza Premium con activos orgánicos. Sentí la frescura e hidratación desde la primera sesión.',
    likes: 142,
    compartidos: 35
  },
  {
    id: 'p3',
    titulo: 'Gift Card Día de la Madre',
    plataforma: 'Facebook',
    estado: 'Borrador',
    fechaPublicacion: new Date(Date.now() + 432000000).toISOString().split('T')[0], // en 5 días
    horaPublicacion: '11:00',
    contenido: 'Regalá bienestar, regalá amor. ❤️ Obsequiá una Gift Card de ECAR Estética cargada con el tratamiento que mamá más prefiera (Facial, Masajes, Spa de manos).'
  }
];

const mockChats: Chat[] = [
  {
    id: 'c1',
    clienteId: 'c1',
    clienteNombre: 'Valentina Rossi',
    clienteTelefono: '+54 9 11 5472-8812',
    ultimoMensaje: 'Hola Vale! Sí, te esperamos. Recordá venir sin maquillaje si es posible.',
    fechaUltimoMensaje: '11:42',
    noLeidos: 0,
    mensajes: [
      { id: 'm1', sender: 'cliente', texto: 'Hola! Quería confirmar el turno de hoy a las 15:30. Sigue en pie?', fecha: '11:30', leido: true },
      { id: 'm2', sender: 'nosotros', texto: 'Hola Vale! Sí, totalmente confirmado. Te esperamos.', fecha: '11:35', leido: true },
      { id: 'm3', sender: 'cliente', texto: 'Perfecto, llevo la piel limpia o me desmaquillo allá?', fecha: '11:40', leido: true },
      { id: 'm4', sender: 'nosotros', texto: 'Hola Vale! Sí, te esperamos. Recordá venir sin maquillaje si es posible.', fecha: '11:42', leido: true }
    ]
  },
  {
    id: 'c2',
    clienteId: 'c2',
    clienteNombre: 'Camila Fernández',
    clienteTelefono: '+54 9 341 682-1194',
    ultimoMensaje: 'Dale buenísimo, reservame ese!',
    fechaUltimoMensaje: '10:15',
    noLeidos: 1,
    mensajes: [
      { id: 'm5', sender: 'cliente', texto: 'Hola! Tienen lugar para manicura hoy a la tarde?', fecha: '10:02', leido: true },
      { id: 'm6', sender: 'nosotros', texto: 'Hola Cami! Sí, tenemos un espacio disponible a las 17:00 hs. ¿Te sirve?', fecha: '10:10', leido: true },
      { id: 'm7', sender: 'cliente', texto: 'Dale buenísimo, reservame ese!', fecha: '10:15', leido: false }
    ]
  },
  {
    id: 'c5',
    clienteId: 'c5',
    clienteNombre: 'María Florencia Díaz',
    clienteTelefono: '+54 9 351 771-4433',
    ultimoMensaje: 'Hola, me pasarías los precios de depilación definitiva?',
    fechaUltimoMensaje: 'Ayer',
    noLeidos: 0,
    mensajes: [
      { id: 'm8', sender: 'cliente', texto: 'Hola, me pasarías los precios de depilación definitiva?', fecha: 'Ayer', leido: true }
    ]
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      clientes: mockClientes,
      turnos: mockTurnos,
      posts: mockPosts,
      chats: mockChats,
      activeChatId: 'c1',

      // Clientes CRUD
      addCliente: (clienteData) => {
        const nuevoCliente: Cliente = {
          ...clienteData,
          id: 'c_' + Math.random().toString(36).substr(2, 9),
          fechaRegistro: new Date().toISOString().split('T')[0],
          historialServicios: []
        };
        set((state) => ({
          clientes: [nuevoCliente, ...state.clientes]
        }));
        return nuevoCliente;
      },
      updateCliente: (id, updates) => set((state) => ({
        clientes: state.clientes.map(c => c.id === id ? { ...c, ...updates } : c),
        turnos: state.turnos.map(t => t.clienteId === id ? { ...t, clienteNombre: updates.nombre || t.clienteNombre } : t),
        chats: state.chats.map(ch => ch.clienteId === id ? { ...ch, clienteNombre: updates.nombre || ch.clienteNombre, clienteTelefono: updates.telefono || ch.clienteTelefono } : ch)
      })),
      deleteCliente: (id) => set((state) => ({
        clientes: state.clientes.filter(c => c.id !== id),
        turnos: state.turnos.filter(t => t.clienteId !== id),
        chats: state.chats.filter(ch => ch.clienteId !== id),
        activeChatId: state.activeChatId === id ? null : state.activeChatId
      })),

      // Turnos CRUD
      addTurno: (turnoData) => {
        const nuevoTurno: Turno = {
          ...turnoData,
          id: 't_' + Math.random().toString(36).substr(2, 9)
        };
        set((state) => {
          // Agregar al historial de servicios si es realizado
          const updatedClientes = state.clientes.map(c => {
            if (c.id === turnoData.clienteId && turnoData.estado === 'Realizado') {
              const historial = c.historialServicios || [];
              if (!historial.includes(turnoData.servicio)) {
                return { ...c, historialServicios: [...historial, turnoData.servicio] };
              }
            }
            return c;
          });
          return {
            turnos: [nuevoTurno, ...state.turnos],
            clientes: updatedClientes
          };
        });
      },
      updateTurnoEstado: (id, estado) => set((state) => {
        const turno = state.turnos.find(t => t.id === id);
        const updatedTurnos = state.turnos.map(t => t.id === id ? { ...t, estado } : t);
        
        let updatedClientes = state.clientes;
        if (turno && estado === 'Realizado') {
          updatedClientes = state.clientes.map(c => {
            if (c.id === turno.clienteId) {
              const historial = c.historialServicios || [];
              if (!historial.includes(turno.servicio)) {
                return { ...c, historialServicios: [...historial, turno.servicio] };
              }
            }
            return c;
          });
        }
        
        return {
          turnos: updatedTurnos,
          clientes: updatedClientes
        };
      }),
      deleteTurno: (id) => set((state) => ({
        turnos: state.turnos.filter(t => t.id !== id)
      })),

      // Redes Sociales CRUD
      addPost: (postData) => {
        const nuevoPost: SocialPost = {
          ...postData,
          id: 'p_' + Math.random().toString(36).substr(2, 9),
          likes: postData.estado === 'Publicado' ? Math.floor(Math.random() * 100) + 10 : 0,
          compartidos: postData.estado === 'Publicado' ? Math.floor(Math.random() * 20) + 2 : 0
        };
        set((state) => ({
          posts: [nuevoPost, ...state.posts]
        }));
      },
      updatePost: (id, updates) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter(p => p.id !== id)
      })),

      // WhatsApp Chat Actions
      setActiveChat: (chatId) => {
        set({ activeChatId: chatId });
        if (chatId) {
          get().marcarComoLeido(chatId);
        }
      },
      sendMensaje: (chatId, texto) => {
        const ahora = new Date();
        const horaStr = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;
        const nuevoMsg: Mensaje = {
          id: 'msg_' + Math.random().toString(36).substr(2, 9),
          sender: 'nosotros',
          texto,
          fecha: horaStr,
          leido: true
        };

        set((state) => {
          const chatsActualizados = state.chats.map(ch => {
            if (ch.id === chatId) {
              return {
                ...ch,
                ultimoMensaje: texto,
                fechaUltimoMensaje: horaStr,
                mensajes: [...ch.mensajes, nuevoMsg]
              };
            }
            return ch;
          });
          return { chats: chatsActualizados };
        });

        // Simular respuesta del cliente después de 3 a 5 segundos
        setTimeout(() => {
          const chatActivo = get().chats.find(c => c.id === chatId);
          if (!chatActivo) return;

          let respuesta = '';
          const ultimosMensajes = chatActivo.mensajes;
          const textoEnviado = texto.toLowerCase();

          if (textoEnviado.includes('hola') || textoEnviado.includes('buenos dias') || textoEnviado.includes('buenas tardes')) {
            respuesta = `¡Hola! ¿Cómo estás? Quería consultar si tenés turnos disponibles para esta semana.`;
          } else if (textoEnviado.includes('turno') || textoEnviado.includes('confirmado') || textoEnviado.includes('confirmá')) {
            respuesta = `¡Bárbaro! Muchísimas gracias. Agendado. Nos vemos en la estética.`;
          } else if (textoEnviado.includes('precio') || textoEnviado.includes('sale') || textoEnviado.includes('costo') || textoEnviado.includes('$')) {
            respuesta = `¡Buenísimo! Me re interesa. ¿Qué horarios tenés libres por la tarde para reservar?`;
          } else {
            respuesta = `Dale, genial. Muchas gracias por la información, ¡que tengas un lindo día! ✨`;
          }

          get().recibirMensajeSimulado(chatId, respuesta);
        }, 4000);
      },
      recibirMensajeSimulado: (chatId, texto) => {
        const ahora = new Date();
        const horaStr = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;
        const nuevoMsg: Mensaje = {
          id: 'msg_' + Math.random().toString(36).substr(2, 9),
          sender: 'cliente',
          texto,
          fecha: horaStr,
          leido: false
        };

        set((state) => {
          const chatsActualizados = state.chats.map(ch => {
            if (ch.id === chatId) {
              const isActive = state.activeChatId === chatId;
              return {
                ...ch,
                ultimoMensaje: texto,
                fechaUltimoMensaje: horaStr,
                noLeidos: isActive ? 0 : ch.noLeidos + 1,
                mensajes: [...ch.mensajes, nuevoMsg]
              };
            }
            return ch;
          });
          return { chats: chatsActualizados };
        });
      },
      marcarComoLeido: (chatId) => set((state) => ({
        chats: state.chats.map(ch => ch.id === chatId ? { ...ch, noLeidos: 0, mensajes: ch.mensajes.map(m => ({ ...m, leido: true })) } : ch)
      })),
      crearChat: (clienteId) => {
        const state = get();
        const chatExistente = state.chats.find(c => c.clienteId === clienteId);
        if (chatExistente) {
          set({ activeChatId: chatExistente.id });
          return chatExistente.id;
        }

        const cliente = state.clientes.find(c => c.id === clienteId);
        if (!cliente) return '';

        const nuevoChat: Chat = {
          id: clienteId, // Usamos clienteId como chatId
          clienteId: cliente.id,
          clienteNombre: cliente.nombre,
          clienteTelefono: cliente.telefono,
          ultimoMensaje: 'Conversación iniciada.',
          fechaUltimoMensaje: 'Reciente',
          noLeidos: 0,
          mensajes: []
        };

        set((state) => ({
          chats: [nuevoChat, ...state.chats],
          activeChatId: nuevoChat.id
        }));

        return nuevoChat.id;
      }
    }),
    {
      name: 'ecar-estetica-storage',
      partialize: (state) => ({
        clientes: state.clientes,
        turnos: state.turnos,
        posts: state.posts,
        chats: state.chats,
      }),
    }
  )
);
