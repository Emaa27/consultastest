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

// Mapeo de estados a colores y etiquetas
const estadoConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  reservado: { label: 'Reservado', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  confirmado: { label: 'Confirmado', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  en_consulta: { label: 'En Consulta', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  atendido: { label: 'Atendido', color: 'text-green-700', bgColor: 'bg-green-100' },
  ausente: { label: 'Ausente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  cancelado: { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-100' },
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
    <div className="p-4 sm:p-8 space-y-6 bg-gray-50 min-h-screen lg:pl-28 pt-20 lg:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/gerencia/metricas"
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-[#16a34a]" />
              Historial de Turnos
            </h1>
          </div>
          <p className="text-gray-600 ml-14">
            Visualiza y filtra todos los turnos del consultorio
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#16a34a]" />
          <h2 className="text-lg font-bold text-gray-800">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Paciente, profesional o documento..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Fecha Desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <input
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <input
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todos</option>
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
          <div className="mt-4">
            <button
              onClick={limpiarFiltros}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Resultados */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <p className="text-sm font-medium text-gray-700">
            {loading ? 'Cargando...' : `${turnosFiltrados.length} turnos encontrados`}
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Cargando turnos...
          </div>
        ) : turnosFiltrados.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No se encontraron turnos con los filtros aplicados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Obra Social
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {turnosFiltrados.map((turno) => {
                  const config = estadoConfig[turno.estado] || {
                    label: turno.estado,
                    color: 'text-gray-700',
                    bgColor: 'bg-gray-100',
                  };

                  return (
                    <tr key={turno.turno_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatearFecha(turno.inicio)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatearHora(turno.inicio)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="font-medium">
                          {turno.pacientes.nombre} {turno.pacientes.apellido}
                        </div>
                        <div className="text-xs text-gray-500">
                          DNI: {turno.pacientes.documento}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="font-medium">
                          {turno.profesionales.usuarios.nombre} {turno.profesionales.usuarios.apellido}
                        </div>
                        <div className="text-xs text-gray-500">
                          {turno.profesionales.profesiones.nombre}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {turno.pacientes.obras_sociales?.nombre || 'Particular'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bgColor} ${config.color}`}
                        >
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
  );
}
