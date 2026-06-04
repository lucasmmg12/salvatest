export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  notas: string;
  fechaRegistro: string;
  historialServicios?: string[];
}

export type TurnoEstado = 'Pendiente' | 'Confirmado' | 'Cancelado' | 'Realizado';

export interface Turno {
  id: string;
  clienteId: string;
  clienteNombre: string; // Desnormalizado para búsquedas rápidas
  servicio: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:MM
  estado: TurnoEstado;
  precio: number;
  notas?: string;
}

export type PlataformaSocial = 'Instagram' | 'Facebook' | 'TikTok' | 'Pinterest';
export type PostEstado = 'Borrador' | 'Programado' | 'Publicado';

export interface SocialPost {
  id: string;
  titulo: string;
  plataforma: PlataformaSocial;
  estado: PostEstado;
  fechaPublicacion: string; // YYYY-MM-DD
  horaPublicacion: string; // HH:MM
  contenido: string;
  imagenUrl?: string;
  likes?: number;
  compartidos?: number;
}

export interface Mensaje {
  id: string;
  sender: 'cliente' | 'nosotros';
  texto: string;
  fecha: string; // HH:MM o fecha completa
  leido: boolean;
}

export interface Chat {
  id: string; // Generalmente coincide con el clienteId
  clienteId: string;
  clienteNombre: string;
  clienteTelefono: string;
  ultimoMensaje: string;
  fechaUltimoMensaje: string;
  noLeidos: number;
  mensajes: Mensaje[];
}
