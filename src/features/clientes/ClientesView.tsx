import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  Edit2, 
  Trash2, 
  X, 
  UserPlus,
  BookOpen
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Cliente } from '../../types';

interface ClientesViewProps {
  setActiveTab: (tab: string) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({ setActiveTab }) => {
  const { clientes, addCliente, updateCliente, deleteCliente, crearChat } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [notas, setNotas] = useState('');

  const resetForm = () => {
    setNombre('');
    setTelefono('');
    setEmail('');
    setNotas('');
    setEditingCliente(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setNombre(cliente.nombre);
    setTelefono(cliente.telefono);
    setEmail(cliente.email);
    setNotas(cliente.notas);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      alert('Ingresá al menos el nombre y el teléfono del cliente.');
      return;
    }

    const data = { nombre, telefono, email, notas };

    if (editingCliente) {
      updateCliente(editingCliente.id, data);
    } else {
      addCliente(data);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar a ${nombre}? Se borrarán también sus turnos y chats.`)) {
      deleteCliente(id);
    }
  };

  const handleStartChat = (clienteId: string) => {
    const chatId = crearChat(clienteId);
    if (chatId) {
      setActiveTab('whatsapp');
    }
  };

  // Filtrado de clientes
  const filteredClientes = clientes.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefono.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (nombre: string) => {
    const parts = nombre.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (nombre[0] || '').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header de Módulo (Gradient Banner) */}
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Users size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <Users size={24} /> Legajos de Clientes
          </h3>
          <p className="text-indigo-100 text-sm mt-1">
            Administrá la base de datos de tus clientes, consultá sus notas de tratamiento e iniciá conversaciones directas.
          </p>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <Users size={16} className="text-indigo-500" /> Total Clientes
          </div>
          <p className="text-2xl font-black text-indigo-600 font-mono">{clientes.length}</p>
          <p className="text-xs text-gray-400 mt-1">Legajos registrados en el sistema</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <BookOpen size={16} className="text-emerald-500" /> Fichas con Notas
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            {clientes.filter(c => c.notas && c.notas.trim().length > 0).length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Clientes con recomendaciones o detalles de piel</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <MessageSquare size={16} className="text-blue-500" /> Canales de WhatsApp Activos
          </div>
          <p className="text-2xl font-black text-blue-600 font-mono">
            {clientes.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Vías de comunicación configuradas</p>
        </div>
      </div>

      {/* 3. Barra de Búsqueda y Botón Registrar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Input Buscador */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Buscá por nombre, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ecar-blue/30 focus:border-ecar-blue transition-all bg-white"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Botón Primary */}
        <button
          onClick={handleOpenCreateModal}
          className="btn-primary w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Registrar Cliente
        </button>
      </div>

      {/* 4. Tabla de Datos */}
      <div className="data-table-wrapper">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 text-sm">Listado General</h3>
        </div>
        
        {filteredClientes.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-30 text-indigo-500" />
            <p className="font-medium">No se encontraron clientes</p>
            <p className="text-sm">Intentá buscar con otros términos o registrá un nuevo cliente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead className="data-table-thead">
                <tr>
                  <th className="data-table-th">Cliente</th>
                  <th className="data-table-th">Teléfono</th>
                  <th className="data-table-th">Email</th>
                  <th className="data-table-th">Fecha Registro</th>
                  <th className="data-table-th">Notas / Detalles</th>
                  <th className="data-table-th text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="data-table-tr">
                    <td className="data-table-td">
                      <div className="flex items-center gap-3">
                        {/* Avatar Circles (Iniciales) */}
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {getInitials(cliente.nombre)}
                        </div>
                        <span className="font-bold text-gray-800">{cliente.nombre}</span>
                      </div>
                    </td>
                    <td className="data-table-td font-mono text-xs">{cliente.telefono}</td>
                    <td className="data-table-td text-gray-500 text-xs">{cliente.email || '—'}</td>
                    <td className="data-table-td font-mono text-xs text-gray-400">{cliente.fechaRegistro}</td>
                    <td className="data-table-td">
                      <p className="text-xs text-gray-500 max-w-xs truncate" title={cliente.notas}>
                        {cliente.notas || <span className="text-gray-300 italic">Sin notas</span>}
                      </p>
                    </td>
                    <td className="data-table-td text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Iniciar Chat de WhatsApp */}
                        <button
                          onClick={() => handleStartChat(cliente.id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Chatear por WhatsApp"
                        >
                          <MessageSquare size={16} />
                        </button>
                        
                        {/* Editar */}
                        <button
                          onClick={() => handleOpenEditModal(cliente)}
                          className="p-1.5 rounded-lg text-ecar-blue hover:bg-blue-50 transition-colors"
                          title="Editar Ficha"
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* Eliminar */}
                        <button
                          onClick={() => handleDelete(cliente.id, cliente.nombre)}
                          className="p-1.5 rounded-lg text-ecar-red hover:bg-red-50 transition-colors"
                          title="Eliminar Cliente"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Modal de Formulario (Crear/Editar) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserPlus size={20} className="text-ecar-blue" />
                {editingCliente ? 'Editar Ficha de Cliente' : 'Registrar Nuevo Cliente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Valentina Rossi"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Teléfono / Celular *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: +54 9 11 5472-8812"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="Ej: correo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Notas Clínicas / Ficha Estética</label>
                <textarea
                  placeholder="Detallá preferencias del cliente, tipo de piel, alergias, contraindicaciones..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="form-input h-24 resize-none"
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
                  {editingCliente ? 'Guardar Cambios' : 'Registrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
