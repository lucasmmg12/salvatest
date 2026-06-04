import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  MessageSquare, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Bell
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Turno, TurnoEstado } from '../../types';

interface TurnosViewProps {
  setActiveTab: (tab: string) => void;
}

export const TurnosView: React.FC<TurnosViewProps> = ({ setActiveTab }) => {
  const { 
    turnos, 
    clientes, 
    addTurno, 
    updateTurnoEstado, 
    deleteTurno,
    crearChat,
    sendMensaje
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<string>('Todos');

  // Form State
  const [clienteId, setClienteId] = useState('');
  const [servicio, setServicio] = useState('Manicura Semipermanente');
  const [otroServicio, setOtroServicio] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState('14:00');
  const [precio, setPrecio] = useState(12000);
  const [notas, setNotas] = useState('');

  const serviciosPredefinidos = [
    'Manicura Semipermanente',
    'Limpieza facial profunda',
    'Masaje Descontracturante',
    'Perfilado de cejas + Laminado',
    'Lifting de pestañas',
    'Depilación Definitiva (Soprano)',
    'Alisado de cabello',
    'Otro'
  ];

  const resetForm = () => {
    setClienteId(clientes[0]?.id || '');
    setServicio('Manicura Semipermanente');
    setOtroServicio('');
    setFecha(new Date().toISOString().split('T')[0]);
    setHora('14:00');
    setPrecio(12000);
    setNotas('');
  };

  const handleOpenCreateModal = () => {
    if (clientes.length === 0) {
      alert('Tenés que registrar al menos un cliente en la sección "Legajos Clientes" antes de agendar un turno.');
      return;
    }
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) {
      alert('Seleccioná un cliente.');
      return;
    }

    const clienteObj = clientes.find(c => c.id === clienteId);
    if (!clienteObj) return;

    const servicioFinal = servicio === 'Otro' ? otroServicio : servicio;
    if (servicio === 'Otro' && !otroServicio.trim()) {
      alert('Ingresá el nombre del servicio personalizado.');
      return;
    }

    addTurno({
      clienteId,
      clienteNombre: clienteObj.nombre,
      servicio: servicioFinal,
      fecha,
      hora,
      estado: 'Pendiente',
      precio: Number(precio),
      notas
    });

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, cliente: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar el turno de ${cliente}?`)) {
      deleteTurno(id);
    }
  };

  const handleSendReminder = (turno: Turno) => {
    const cliente = clientes.find(c => c.id === turno.clienteId);
    if (!cliente) return;

    // Crear el chat si no existe
    const chatId = crearChat(turno.clienteId);

    // Formatear mensaje del recordatorio en español argentino
    const mensajeRecordatorio = `Hola ${cliente.nombre}! Te recordamos tu turno en ECAR Estética para el día ${turno.fecha} a las ${turno.hora} hs. para realizarte el servicio de *${turno.servicio}*. ¿Nos confirmás asistencia? ¡Te esperamos! ✨`;
    
    // Enviar mensaje al chat
    sendMensaje(chatId, mensajeRecordatorio);

    // Notificar al usuario
    alert(`¡Recordatorio enviado al chat de WhatsApp de ${cliente.nombre}!`);
    setActiveTab('whatsapp');
  };

  // Filtrado de turnos
  const filteredTurnos = turnos.filter(t => {
    const matchDate = selectedDate ? t.fecha === selectedDate : true;
    const matchEstado = selectedEstado === 'Todos' ? true : t.estado === selectedEstado;
    return matchDate && matchEstado;
  });

  // Ordenar turnos: fecha descendente, hora descendente
  const sortedTurnos = [...filteredTurnos].sort((a, b) => {
    const diffFecha = b.fecha.localeCompare(a.fecha);
    if (diffFecha !== 0) return diffFecha;
    return b.hora.localeCompare(a.hora);
  });

  const getEstadoBadge = (estado: TurnoEstado) => {
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

  // KPIs
  const totalActivos = turnos.filter(t => t.estado === 'Confirmado' || t.estado === 'Pendiente').length;
  const totalConfirmados = turnos.filter(t => t.estado === 'Confirmado').length;
  
  const ingresosCobrados = turnos
    .filter(t => t.estado === 'Realizado')
    .reduce((acc, t) => acc + t.precio, 0);

  const ingresosEstimados = turnos
    .filter(t => t.estado === 'Confirmado' || t.estado === 'Pendiente')
    .reduce((acc, t) => acc + t.precio, 0);

  return (
    <div className="space-y-6">
      {/* 1. Header de Módulo (Gradient Banner) */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Calendar size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <Calendar size={24} /> Agenda y Turnos
          </h3>
          <p className="text-emerald-100 text-sm mt-1">
            Programá y organizá las visitas de tus clientes. Confirmá, cancelá o finalizá tratamientos, y enviá recordatorios de WhatsApp automatizados.
          </p>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <Clock size={16} className="text-amber-500" /> Turnos Activos
          </div>
          <p className="text-2xl font-black text-gray-800 font-mono">{totalActivos}</p>
          <p className="text-xs text-gray-400 mt-1">{totalConfirmados} turnos ya confirmados</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <RefreshCw size={16} className="text-emerald-500" /> Facturación Cobrada
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">$ {ingresosCobrados.toLocaleString('es-AR')}</p>
          <p className="text-xs text-gray-400 mt-1">Suma de tratamientos con estado 'Realizado'</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <AlertCircle size={16} className="text-blue-500" /> Facturación Estimada (Por Cobrar)
          </div>
          <p className="text-2xl font-black text-blue-600 font-mono">$ {ingresosEstimados.toLocaleString('es-AR')}</p>
          <p className="text-xs text-gray-400 mt-1">Turnos pendientes y confirmados agendados</p>
        </div>
      </div>

      {/* 3. Filtros y Botón Agendar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Filtro Fecha */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Filtrar por Fecha</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-ecar-blue bg-white"
            />
          </div>

          {/* Filtro Estado */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Filtrar por Estado</span>
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-ecar-blue bg-white"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Confirmado">Confirmados</option>
              <option value="Realizado">Realizados</option>
              <option value="Cancelado">Cancelados</option>
            </select>
          </div>

          {/* Limpiar Filtros */}
          {(selectedDate || selectedEstado !== 'Todos') && (
            <button
              onClick={() => {
                setSelectedDate('');
                setSelectedEstado('Todos');
              }}
              className="mt-4 px-2 py-1.5 text-xs text-ecar-red hover:underline font-bold"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Botón Agendar */}
        <button
          onClick={handleOpenCreateModal}
          className="btn-primary w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Agendar Turno
        </button>
      </div>

      {/* 4. Tabla de Agenda */}
      <div className="data-table-wrapper">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm">Cronograma de Turnos</h3>
        </div>

        {sortedTurnos.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Calendar size={48} className="mx-auto mb-3 opacity-30 text-emerald-500" />
            <p className="font-medium">No se encontraron turnos</p>
            <p className="text-sm">Probá cambiando los filtros o creá un nuevo turno desde el botón superior.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead className="data-table-thead">
                <tr>
                  <th className="data-table-th">Fecha y Hora</th>
                  <th className="data-table-th">Cliente</th>
                  <th className="data-table-th">Servicio</th>
                  <th className="data-table-th">Valor</th>
                  <th className="data-table-th">Estado</th>
                  <th className="data-table-th">Notas</th>
                  <th className="data-table-th text-right">Acciones de Agenda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedTurnos.map((turno) => (
                  <tr key={turno.id} className="data-table-tr">
                    <td className="data-table-td">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 font-mono text-xs">{turno.fecha}</span>
                        <span className="text-[11px] text-gray-400 font-mono font-bold flex items-center gap-1 mt-0.5">
                          <Clock size={11} className="text-ecar-blue" />
                          {turno.hora} hs
                        </span>
                      </div>
                    </td>
                    <td className="data-table-td font-bold text-gray-700">{turno.clienteNombre}</td>
                    <td className="data-table-td">
                      <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[11px] font-bold">
                        {turno.servicio}
                      </span>
                    </td>
                    <td className="data-table-td font-mono font-bold text-gray-900 text-xs">
                      $ {turno.precio.toLocaleString('es-AR')}
                    </td>
                    <td className="data-table-td">{getEstadoBadge(turno.estado)}</td>
                    <td className="data-table-td text-xs text-gray-400 max-w-xs truncate" title={turno.notes}>
                      {turno.notas || '—'}
                    </td>
                    <td className="data-table-td text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Acciones de estado contextuales */}
                        {turno.estado === 'Pendiente' && (
                          <button
                            onClick={() => updateTurnoEstado(turno.id, 'Confirmado')}
                            className="bg-green-600 text-white p-1 rounded-lg hover:bg-green-700 transition-colors"
                            title="Confirmar Asistencia"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {turno.estado === 'Confirmado' && (
                          <button
                            onClick={() => updateTurnoEstado(turno.id, 'Realizado')}
                            className="bg-ecar-blue text-white p-1 rounded-lg hover:bg-ecar-blueDark transition-colors"
                            title="Finalizar/Cobrar"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {(turno.estado === 'Pendiente' || turno.estado === 'Confirmado') && (
                          <button
                            onClick={() => updateTurnoEstado(turno.id, 'Cancelado')}
                            className="bg-red-100 text-red-700 p-1 rounded-lg hover:bg-red-200 transition-colors"
                            title="Cancelar Turno"
                          >
                            <X size={14} />
                          </button>
                        )}

                        {/* Enviar recordatorio por WhatsApp */}
                        {(turno.estado === 'Pendiente' || turno.estado === 'Confirmado') && (
                          <button
                            onClick={() => handleSendReminder(turno)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Enviar Recordatorio WhatsApp"
                          >
                            <Bell size={14} />
                          </button>
                        )}

                        <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>

                        {/* Eliminar Turno */}
                        <button
                          onClick={() => handleDelete(turno.id, turno.clienteNombre)}
                          className="p-1.5 rounded-lg text-ecar-red hover:bg-red-50 transition-colors"
                          title="Eliminar Turno"
                        >
                          <Trash2 size={14} />
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

      {/* 5. Modal de Creación */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-600" />
                Agendar Nuevo Turno
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selección Cliente */}
              <div>
                <label className="form-label">Seleccioná el Cliente *</label>
                <select
                  required
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="form-select w-full"
                >
                  <option value="" disabled>Elegí un cliente...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.telefono})
                    </option>
                  ))}
                </select>
              </div>

              {/* Servicio */}
              <div>
                <label className="form-label">Servicio / Tratamiento *</label>
                <select
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                  className="form-select w-full mb-2"
                >
                  {serviciosPredefinidos.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {servicio === 'Otro' && (
                  <input
                    type="text"
                    required
                    placeholder="Especificá el tratamiento (ej: Tratamiento Antiage)"
                    value={otroServicio}
                    onChange={(e) => setOtroServicio(e.target.value)}
                    className="form-input"
                  />
                )}
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Fecha del Turno *</label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Hora *</label>
                  <input
                    type="time"
                    required
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Precio */}
              <div>
                <label className="form-label">Precio / Valor del Servicio ($ ARS) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Ej: 12000"
                  value={precio}
                  onChange={(e) => setPrecio(Number(e.target.value))}
                  className="form-input font-mono"
                />
              </div>

              {/* Notas */}
              <div>
                <label className="form-label">Notas o Recomendaciones</label>
                <textarea
                  placeholder="Notas especiales para esta sesión..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="form-input h-20 resize-none"
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
                  Agendar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
