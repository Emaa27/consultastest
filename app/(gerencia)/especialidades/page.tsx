'use client';
import React, { useEffect, useState } from 'react';

/* ---------------- Íconos ---------------- */
const EspecialidadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 2l7 4v5c0 5.25-3.5 10-7 11-3.5-1-7-5.75-7-11V6l7-4z" />
    <path d="M12 2v20" />
  </svg>
);

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

/* ---------------- Tipos ---------------- */
interface Especialidad {
  profesion_id: number;
  nombre: string;
  descripcion?: string | null;
  active?: 'activo' | 'inactivo' | null;
}

/* ---------------- Página principal ---------------- */
export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  const fetchEspecialidades = async () => {
    try {
      const res = await fetch('/api/especialidades');
      const data = await res.json();
      setEspecialidades(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre de la especialidad es obligatorio' });
      return;
    }

    try {
      const res = await fetch('/api/especialidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al registrar');

      setMensaje({ tipo: 'ok', texto: 'Especialidad registrada correctamente' });
      setNombre('');
      setDescripcion('');
      setShowForm(false);
      fetchEspecialidades();
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message || 'Error al registrar la especialidad' });
    }
  };

  const handleToggleActive = async (id: number, nuevoEstado: 'activo' | 'inactivo') => {
    try {
      const res = await fetch('/api/especialidades', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: nuevoEstado }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar estado');

      setMensaje({
        tipo: 'ok',
        texto: nuevoEstado === 'activo' ? 'Especialidad activada' : 'Especialidad desactivada',
      });

      fetchEspecialidades();
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message || 'Error al cambiar estado' });
    }
  };

  const especialidadesFiltradas = especialidades.filter((esp) =>
    esp.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="relative p-8 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/40 min-h-screen overflow-hidden">
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-100/40 rounded-full blur-2xl"></div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
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
            <EspecialidadIcon className="w-6 h-6 text-white/90" />
            <span className="text-white/90 font-bold text-lg">Especialidades Médicas</span>
          </div>
        </div>

        {/* Header mejorado */}
        <div className="mb-6 bg-white rounded-2xl p-8 shadow-xl border-2 border-green-100 relative overflow-hidden">
          {/* Patrón decorativo de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            <svg viewBox="0 0 200 200" className="w-full h-full text-green-600">
              <defs>
                <pattern id="specialty-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 10 L20 30 M10 20 L30 20" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="20" cy="20" r="3" fill="currentColor"/>
                </pattern>
              </defs>
              <rect width="200" height="200" fill="url(#specialty-pattern)"/>
            </svg>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <EspecialidadIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-1">
                  Profesiones
                </h1>
                <p className="text-gray-600 text-lg">Gestión del catálogo de servicios</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold"
            >
              <Plus className="w-5 h-5" />
              Nueva Especialidad
            </button>
          </div>
        </div>

        {/* Mensaje mejorado */}
        {mensaje && (
          <div
            className={`mb-6 p-4 rounded-xl border-2 text-center font-semibold shadow-md animate-slideDown ${
              mensaje.tipo === 'ok'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-700'
                : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300 text-red-700'
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        {/* Buscador mejorado */}
        <div className="mb-6 flex items-center gap-3 bg-white border-2 border-green-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
          <div className="p-2 bg-green-50 rounded-lg">
            <Search className="w-5 h-5 text-green-600" />
          </div>
          <input
            type="text"
            placeholder="Buscar especialidad por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 font-medium"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Lista mejorada */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-green-50">
            <div className="p-2 bg-green-50 rounded-lg">
              <EspecialidadIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-xl text-gray-800">
              Catálogo de Especialidades
            </h3>
            <span className="ml-auto px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-200">
              {especialidadesFiltradas.length} {especialidadesFiltradas.length === 1 ? 'especialidad' : 'especialidades'}
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <EspecialidadIcon className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Cargando especialidades...</p>
            </div>
          ) : especialidadesFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-6 bg-gray-50 rounded-full mb-4">
                <EspecialidadIcon className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron especialidades</h3>
              <p className="text-gray-500">
                {busqueda ? 'Intenta ajustar tu búsqueda' : 'Comienza agregando una nueva especialidad'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {especialidadesFiltradas.map((esp, index) => (
                <div
                  key={esp.profesion_id}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    esp.active === 'activo'
                      ? 'bg-gradient-to-br from-white to-green-50 border-green-200 hover:border-green-300'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 opacity-75'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInCard 0.4s ease-out forwards',
                    opacity: 0
                  }}
                >
                  {/* Indicador de estado */}
                  <div className="absolute top-4 right-4">
                    <span className={`flex h-3 w-3`}>
                      {esp.active === 'activo' && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${
                        esp.active === 'activo' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                    </span>
                  </div>

                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-3 rounded-xl shadow-md ${
                          esp.active === 'activo' 
                            ? 'bg-gradient-to-br from-green-100 to-emerald-200' 
                            : 'bg-gray-200'
                        }`}>
                          <EspecialidadIcon className={`w-6 h-6 ${
                            esp.active === 'activo' ? 'text-green-700' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg leading-tight">
                            {esp.nombre}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {esp.descripcion || 'Sin descripción disponible'}
                      </p>
                    </div>

                    <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={() =>
                          handleToggleActive(
                            esp.profesion_id,
                            (esp.active ?? 'inactivo') === 'activo' ? 'inactivo' : 'activo'
                          )
                        }
                        className={`px-5 py-2.5 rounded-lg text-white text-sm font-bold transition-all shadow-md hover:shadow-xl flex items-center gap-2 ${
                          esp.active === 'activo'
                            ? 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                        }`}
                      >
                        {esp.active === 'activo' ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Desactivar
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Activar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal mejorado */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border-2 border-green-100 transform animate-slideUp">
            <div className="relative flex justify-between items-center mb-6 pb-4 border-b-2 border-green-50 bg-gradient-to-r from-green-50 to-emerald-50 -m-6 mb-6 p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <EspecialidadIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Nueva Especialidad
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleRegistrar} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  Nombre de la Especialidad *
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Cardiología"
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  Descripción (opcional)
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe brevemente la especialidad..."
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-bold"
                >
                  Registrar Especialidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInCard {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
