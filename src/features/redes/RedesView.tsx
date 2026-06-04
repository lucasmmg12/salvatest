import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Heart, 
  Send, 
  Trash2, 
  Edit2, 
  X, 
  Check,
  Sparkles,
  Bookmark
} from 'lucide-react';

const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
import { useStore } from '../../store/useStore';
import type { SocialPost, PlataformaSocial, PostEstado } from '../../types';

export const RedesView: React.FC = () => {
  const { posts, addPost, updatePost, deletePost } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);

  // Form State
  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState<PlataformaSocial>('Instagram');
  const [estado, setEstado] = useState<PostEstado>('Borrador');
  const [fechaPublicacion, setFechaPublicacion] = useState(new Date().toISOString().split('T')[0]);
  const [horaPublicacion, setHoraPublicacion] = useState('18:00');
  const [contenido, setContenido] = useState('');

  const resetForm = () => {
    setTitulo('');
    setPlataforma('Instagram');
    setEstado('Borrador');
    setFechaPublicacion(new Date().toISOString().split('T')[0]);
    setHoraPublicacion('18:00');
    setContenido('');
    setEditingPost(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: SocialPost) => {
    setEditingPost(post);
    setTitulo(post.titulo);
    setPlataforma(post.plataforma);
    setEstado(post.estado);
    setFechaPublicacion(post.fechaPublicacion);
    setHoraPublicacion(post.horaPublicacion || '18:00');
    setContenido(post.contenido);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim()) {
      alert('Ingresá al menos el título y el contenido de la publicación.');
      return;
    }

    const data = {
      titulo,
      plataforma,
      estado,
      fechaPublicacion,
      horaPublicacion,
      contenido
    };

    if (editingPost) {
      updatePost(editingPost.id, data);
    } else {
      addPost(data);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, titulo: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar el post "${titulo}"?`)) {
      deletePost(id);
    }
  };

  const handleQuickPublish = (id: string) => {
    updatePost(id, { 
      estado: 'Publicado',
      likes: Math.floor(Math.random() * 50) + 5,
      compartidos: Math.floor(Math.random() * 10) + 1
    });
  };

  // Filtrado de publicaciones
  const filteredPosts = posts.filter(p => {
    const matchSearch = p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.contenido.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPlatform = platformFilter === 'Todas' ? true : p.plataforma === platformFilter;
    return matchSearch && matchPlatform;
  });

  const getPlatformIcon = (plataforma: PlataformaSocial) => {
    switch (plataforma) {
      case 'Instagram':
        return <InstagramIcon size={14} className="text-pink-600" />;
      case 'Facebook':
        return <FacebookIcon size={14} className="text-blue-600" />;
      case 'TikTok':
        return <span className="font-black text-[9px] bg-black text-white px-1 rounded">TT</span>;
      default:
        return <Bookmark size={14} className="text-red-500" />;
    }
  };

  const getEstadoBadge = (estado: PostEstado) => {
    switch (estado) {
      case 'Publicado':
        return <span className="badge-success">Publicado</span>;
      case 'Programado':
        return <span className="badge-info">Programado</span>;
      case 'Borrador':
        return <span className="badge-gray">Borrador</span>;
      default:
        return <span className="badge-gray">{estado}</span>;
    }
  };

  // KPIs
  const totalPosts = posts.length;
  const programados = posts.filter(p => p.estado === 'Programado').length;
  
  const totalInteracciones = posts
    .filter(p => p.estado === 'Publicado')
    .reduce((acc, p) => acc + (p.likes || 0) + (p.compartidos || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header de Módulo (Gradient Banner) */}
      <div className="bg-gradient-to-r from-violet-800 to-violet-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Share2 size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <Share2 size={24} /> Planificador de Redes
          </h3>
          <p className="text-violet-100 text-sm mt-1">
            Redactá, organizá y calendarizá tus contenidos para Instagram, Facebook o TikTok. Llevá el registro de publicaciones del centro de estética.
          </p>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <Share2 size={16} className="text-violet-500" /> Publicaciones Totales
          </div>
          <p className="text-2xl font-black text-gray-800 font-mono">{totalPosts}</p>
          <p className="text-xs text-gray-400 mt-1">Borradores, programadas y publicadas</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <Calendar size={16} className="text-blue-500" /> Programadas
          </div>
          <p className="text-2xl font-black text-blue-600 font-mono">{programados}</p>
          <p className="text-xs text-gray-400 mt-1">Posts listos para subirse a las redes</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <Heart size={16} className="text-pink-500" /> Total Interacciones
          </div>
          <p className="text-2xl font-black text-pink-600 font-mono">{totalInteracciones}</p>
          <p className="text-xs text-gray-400 mt-1">Likes y compartidos acumulados</p>
        </div>
      </div>

      {/* 3. Filtros y Botón Crear */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Buscador */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-1.5 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-ecar-blue bg-white"
            />
          </div>

          {/* Filtro Plataforma */}
          <div className="flex flex-col">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-ecar-blue bg-white"
            >
              <option value="Todas">Todas las Redes</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="TikTok">TikTok</option>
              <option value="Pinterest">Pinterest</option>
            </select>
          </div>
        </div>

        {/* Botón Crear */}
        <button
          onClick={handleOpenCreateModal}
          className="btn-primary w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Planificar Publicación
        </button>
      </div>

      {/* 4. Grid de Publicaciones */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-16 text-gray-400">
          <Share2 size={48} className="mx-auto mb-3 opacity-30 text-violet-500" />
          <p className="font-medium">No hay publicaciones planificadas</p>
          <p className="text-sm">Creá un nuevo borrador o programá contenido para tus redes sociales.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="light-card-interactive flex flex-col justify-between p-5 min-h-[220px]">
              
              {/* Tarjeta: Cabecera */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-lg text-xs font-bold text-gray-700 border border-gray-200/50">
                    {getPlatformIcon(post.plataforma)}
                    <span>{post.plataforma}</span>
                  </div>
                  {getEstadoBadge(post.estado)}
                </div>

                <h4 className="font-extrabold text-sm text-gray-800 mb-1.5">{post.titulo}</h4>
                <p className="text-xs text-gray-500 line-clamp-4 whitespace-pre-wrap leading-relaxed">
                  {post.contenido}
                </p>
              </div>

              {/* Tarjeta: Footer e Info */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-gray-400 font-bold flex flex-col gap-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {post.fechaPublicacion}
                    </span>
                    {post.horaPublicacion && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {post.horaPublicacion} hs
                      </span>
                    )}
                  </div>

                  {/* Estadísticas de Publicado */}
                  {post.estado === 'Publicado' ? (
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                      <span className="flex items-center gap-1 text-pink-600">
                        <Heart size={12} className="fill-pink-500/20" />
                        {post.likes || 0}
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <Send size={12} />
                        {post.compartidos || 0}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {/* Botón Publicar Rápido */}
                      <button
                        onClick={() => handleQuickPublish(post.id)}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded text-[10px] font-extrabold border border-emerald-200/50 flex items-center gap-1 transition-colors"
                        title="Marcar como publicado"
                      >
                        <Check size={10} /> Publicar
                      </button>
                    </div>
                  )}
                </div>

                {/* Acciones Editar/Eliminar en el footer */}
                <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-gray-100/50">
                  <button
                    onClick={() => handleOpenEditModal(post)}
                    className="p-1 rounded text-gray-400 hover:text-ecar-blue hover:bg-gray-100 transition-colors"
                    title="Editar publicación"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.titulo)}
                    className="p-1 rounded text-gray-400 hover:text-ecar-red hover:bg-gray-100 transition-colors"
                    title="Eliminar publicación"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 5. Modal de Creación / Edición */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sparkles size={20} className="text-violet-600" />
                {editingPost ? 'Editar Publicación' : 'Planificar Publicación'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Título del Post *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Promo Manos Invierno"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Plataforma Red Social *</label>
                  <select
                    value={plataforma}
                    onChange={(e) => setPlataforma(e.target.value as PlataformaSocial)}
                    className="form-select w-full"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Pinterest">Pinterest</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Estado de Publicación *</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as PostEstado)}
                    className="form-select w-full"
                  >
                    <option value="Borrador">Borrador</option>
                    <option value="Programado">Programado</option>
                    <option value="Publicado">Publicado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Fecha Programada *</label>
                  <input
                    type="date"
                    required
                    value={fechaPublicacion}
                    onChange={(e) => setFechaPublicacion(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Hora Programada *</label>
                  <input
                    type="time"
                    required
                    value={horaPublicacion}
                    onChange={(e) => setHoraPublicacion(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Copia de Contenido (Copywrite) *</label>
                <textarea
                  required
                  placeholder="Escribí los copies y hashtags de tu publicación aquí..."
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  className="form-input h-32 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingPost ? 'Guardar Cambios' : 'Planificar Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
