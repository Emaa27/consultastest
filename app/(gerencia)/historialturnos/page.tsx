'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Tipos
interface Turno {
  turno_id: number;
  inicio: string;
  fin: string | null;
  duracion_min: number;
  estado: string;
  pacientes: {
    nombre: string;
    apellido: string;
    documento: string;
    obras_sociales?: {
      nombre: string;
    } | null;
  };
  profesionales: {
    usuarios: {
      nombre: string;
      apellido: string;
    };
    profesiones: {
      nombre: string;
    };
  };
}

// Íconos SVG
const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Filter = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// Mapeo de estados a colores y etiquetas
const estadoConfig: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  reservado: { label: 'Reservado', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  confirmado: { label: 'Confirmado', color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  en_consulta: { label: 'En Consulta', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  atendido: { label: 'Atendido', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  ausente: { label: 'Ausente', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  cancelado: { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
};

export default function HistorialTurnosPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
    busqueda: '',
  });

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/turnos');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Ordenar por fecha más reciente primero
        const turnosOrdenados = data.sort((a, b) => 
          new Date(b.inicio).getTime() - new Date(a.inicio).getTime()
        );
        setTurnos(turnosOrdenados);
      }
    } catch (error) {
      console.error('Error cargando turnos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar turnos
  const turnosFiltrados = turnos.filter((turno) => {
    const fechaTurno = new Date(turno.inicio);
    const cumpleFechaDesde = !filtros.fechaDesde || fechaTurno >= new Date(filtros.fechaDesde);
    const cumpleFechaHasta = !filtros.fechaHasta || fechaTurno <= new Date(filtros.fechaHasta + 'T23:59:59');
    const cumpleEstado = !filtros.estado || turno.estado === filtros.estado;
    
    const textoBusqueda = filtros.busqueda.toLowerCase();
    const cumpleBusqueda = !textoBusqueda || 
      turno.pacientes.nombre.toLowerCase().includes(textoBusqueda) ||
      turno.pacientes.apellido.toLowerCase().includes(textoBusqueda) ||
      turno.pacientes.documento?.toLowerCase().includes(textoBusqueda) ||
      turno.profesionales.usuarios.nombre.toLowerCase().includes(textoBusqueda) ||
      turno.profesionales.usuarios.apellido.toLowerCase().includes(textoBusqueda);

    return cumpleFechaDesde && cumpleFechaHasta && cumpleEstado && cumpleBusqueda;
  });

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatearHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaDesde: '',
      fechaHasta: '',
      estado: '',
      busqueda: '',
    });
  };

  return (
    <main className="relative p-8 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/40 min-h-screen overflow-hidden">
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-100/40 rounded-full blur-2xl"></div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto space-y-6">
        {/* Barra decorativa estilo navbar */}
        <div className="h-16 bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#86efac] rounded-2xl shadow-xl mb-6 flex items-center px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5"></div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute left-0 bottom-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-white/80 rounded-full"></div>
              <div className="w-3 h-3 bg-white/60 rounded-full"></div>
              <div className="w-3 h-3 bg-white/40 rounded-full"></div>
            </div>
            <div className="h-8 w-px bg-white/30 mx-2"></div>
            <Calendar className="w-6 h-6 text-white/90" />
            <span className="text-white/90 font-bold text-lg">Historial de Turnos</span>
          </div>
        </div>

        {/* Header mejorado */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-100 relative overflow-hidden">
          {/* Patrón decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            <svg viewBox="0 0 200 200" className="w-full h-full text-green-600">
              <defs>
                <pattern id="calendar-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="1" y="1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <line x1="1" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="200" height="200" fill="url(#calendar-pattern)"/>
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/metricas"
                className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-110 border-2 border-gray-200 hover:border-green-300"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-1">
                  Historial de Turnos
                </h1>
                <p className="text-gray-600 text-lg">
                  Visualiza y filtra todos los turnos del consultorio
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros mejorados */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-green-50">
            <div className="p-2 bg-green-50 rounded-lg">
              <Filter className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Filtros de Búsqueda</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Paciente, profesional o DNI..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium"
              />
            </div>

            {/* Fecha Desde */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Desde
              </label>
              <input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium"
              />
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Hasta
              </label>
              <input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium"
              >
                <option value="">Todos los estados</option>
                <option value="reservado">Reservado</option>
                <option value="confirmado">Confirmado</option>
                <option value="en_consulta">En Consulta</option>
                <option value="atendido">Atendido</option>
                <option value="ausente">Ausente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Botón limpiar filtros */}
          {(filtros.busqueda || filtros.fechaDesde || filtros.fechaHasta || filtros.estado) && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={limpiarFiltros}
                className="text-sm text-green-600 hover:text-green-700 font-bold hover:underline"
              >
                ✕ Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-green-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-green-50/30 border-b-2 border-green-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-bold text-gray-800">
                {loading ? 'Cargando turnos...' : `${turnosFiltrados.length} ${turnosFiltrados.length === 1 ? 'turno encontrado' : 'turnos encontrados'}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Cargando historial de turnos...</p>
            </div>
          ) : turnosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-6 bg-gray-50 rounded-full mb-4">
                <Calendar className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron turnos</h3>
              <p className="text-gray-500">
                {(filtros.busqueda || filtros.fechaDesde || filtros.fechaHasta || filtros.estado)
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay turnos registrados en el sistema'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-green-50/30 border-b-2 border-green-100">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Hora
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Profesional
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Obra Social
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {turnosFiltrados.map((turno, index) => {
                    const config = estadoConfig[turno.estado] || {
                      label: turno.estado,
                      color: 'text-gray-700',
                      bgColor: 'bg-gray-50',
                      borderColor: 'border-gray-200',
                    };

                    return (
                      <tr 
                        key={turno.turno_id} 
                        className="hover:bg-green-50/30 transition-colors duration-150"
                        style={{
                          animationDelay: `${index * 30}ms`,
                          animation: 'fadeInRow 0.3s ease-out forwards',
                          opacity: 0
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-900">
                              {formatearFecha(turno.inicio)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-900">
                              {formatearHora(turno.inicio)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700 shadow-sm">
                              {turno.pacientes.apellido[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {turno.pacientes.nombre} {turno.pacientes.apellido}
                              </div>
                              <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded inline-block">
                                DNI: {turno.pacientes.documento}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center font-bold text-emerald-700 shadow-sm">
                              {turno.profesionales.usuarios.apellido[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {turno.profesionales.usuarios.nombre} {turno.profesionales.usuarios.apellido}
                              </div>
                              <div className="text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded inline-block">
                                {turno.profesionales.profesiones.nombre}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            {turno.pacientes.obras_sociales?.nombre || 'Particular'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-lg border-2 ${config.bgColor} ${config.color} ${config.borderColor}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`}></span>
                            {config.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </main>
  );
}
