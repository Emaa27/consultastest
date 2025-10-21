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
    <main className="p-6 bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <EspecialidadIcon className="w-6 h-6 text-white" />
            </div>
            Especialidades Médicas
          </h1>
          <p className="text-gray-600">Gestión del catálogo de servicios</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nueva Especialidad
        </button>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div
          className={`mb-4 p-3 rounded-lg border text-center font-medium ${mensaje.tipo === 'ok'
            ? 'bg-green-100 border-green-300 text-green-700'
            : 'bg-red-100 border-red-300 text-red-700'
            }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Buscador */}
      <div className="mb-4 flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar especialidad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <EspecialidadIcon className="w-5 h-5 text-green-600" />
          Catálogo de Especialidades
        </h3>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Cargando especialidades...</div>
        ) : especialidadesFiltradas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No se encontraron especialidades.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {especialidadesFiltradas.map((esp) => (
              <div
                key={esp.profesion_id}
                className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${esp.active === 'activo'
                    ? 'bg-gradient-to-r from-green-100 to-emerald-200 hover:from-green-300 hover:to-emerald-500'
                    : 'bg-gray-100 border-gray-300 opacity-75'
                  }`}
              >
                <div>
                  <p className="font-semibold text-gray-800 text-lg mb-1">
                    {esp.nombre}
                  </p>
                  <p className="text-sm text-gray-600">
                    {esp.descripcion || 'Sin descripción'}
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() =>
                      handleToggleActive(
                        esp.profesion_id,
                        (esp.active ?? 'inactivo') === 'activo' ? 'inactivo' : 'activo'
                      )
                    }
                    className={`px-3 py-1 rounded-lg text-white text-sm font-medium transition-all shadow-md ${esp.active === 'activo'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                      }`}
                  >
                    {esp.active === 'activo' ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <EspecialidadIcon className="w-5 h-5 text-white" />
                </div>
                Registro de Nueva Especialidad
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleRegistrar}>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Cardiología"
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />

              <label className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Opcional"
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              ></textarea>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all shadow-md">
                  Registrar Especialidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
