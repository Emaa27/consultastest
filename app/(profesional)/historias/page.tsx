'use client';
import React, { useEffect, useState } from 'react';

/* ---------------- Íconos locales ---------------- */
const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

/* ---------------- Tipos ---------------- */
interface HistoriaClinica {
  historia_id: number;
  paciente_id: number;
  grupo_sanguineo?: string | null;
  estado_civil?: string | null;
  ocupacion?: string | null;
  enfermedades_infancia?: string | null;
  enfermedades_cronicas?: string | null;
  cirugias?: string | null;
  alergias?: string | null;
  hospitalizaciones?: string | null;
  traumatismos?: string | null;
  medicamentos_actuales?: string | null;
  consume_tabaco: boolean;
  consume_alcohol: boolean;
  otras_sustancias?: string | null;
  dieta_ok: boolean;
  medico_cabecera_id?: number | null;
  sexo?: string | null;
  actividad_fisica?: { descripcion?: string | null } | null;
  habitos_sueno?: { descripcion?: string | null } | null;
  pacientes: { paciente_id: number; nombre: string; apellido: string; documento: string; };
  consultas: Consulta[];
}
interface Consulta {
  consulta_id: number;
  fecha_consulta: string;
  motivo_consulta: string;
  enfermedad_actual?: string | null;
  notas_evolucion?: string | null;
  profesionales?: { usuarios: { nombre: string; apellido: string } } | null;
  diagnosticos: Diagnostico[];
  pruebas_complementarias: PruebaComplementaria[];
}
interface Diagnostico {
  diagnostico_id: number;
  juicio_clinico?: string | null;
  indicacion_terapeutica?: string | null;
  pronostico?: string | null;
}
interface PruebaComplementaria {
  prueba_id: number;
  tipo_prueba: string;
  descripcion: string;
  url_archivo: string;
}

/* ---------------- Página principal ---------------- */
export default function HistoriasPage() {
  const [historias, setHistorias] = useState<HistoriaClinica[]>([]);
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState<HistoriaClinica | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistorias = async () => {
      try {
        const res = await fetch('/api/historias');
        const data = await res.json();
        setHistorias(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistorias();
  }, []);

  //
  const historiasFiltradas = historias
    .filter((h) => {
      const term = searchTerm.toLowerCase().trim();
      const nombre = h.pacientes.nombre.toLowerCase();
      const apellido = h.pacientes.apellido.toLowerCase();
      const dni = h.pacientes.documento.toLowerCase();

      const nombreCompleto = `${nombre} ${apellido}`;
      const apellidoNombre = `${apellido} ${nombre}`;

      return (
        nombre.includes(term) ||
        apellido.includes(term) ||
        dni.includes(term) ||
        nombreCompleto.includes(term) ||
        apellidoNombre.includes(term)
      );
    })
    .sort((a, b) => {
      const apellidoA = a.pacientes.apellido.toLowerCase();
      const apellidoB = b.pacientes.apellido.toLowerCase();
      if (apellidoA < apellidoB) return -1;
      if (apellidoA > apellidoB) return 1;
      return 0;
    });

  return (
    <main className="p-6 bg-gradient-to-br min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Historias Clínicas</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-semibold">Vista Recepcionista</span>
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          Pacientes con historia clínica
        </h3>

        {/* Buscador */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-sky-400
                     placeholder-gray-400 text-gray-700"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Cargando historias...</div>
        ) : historias.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay historias clínicas registradas.</div>
        ) : historiasFiltradas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No se encontraron coincidencias.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historiasFiltradas.map((historia) => (
              <div
                key={historia.historia_id}
                onClick={() => setHistoriaSeleccionada(historia)}
                className="p-5 rounded-xl bg-gradient-to-r from-sky-100 to-sky-200
                         hover:from-sky-300 hover:to-sky-500 cursor-pointer
                         border border-gray-200 transition-all duration-300 hover:shadow-xl"
              >
                <p className="font-semibold text-gray-800 text-lg">
                  {historia.pacientes.apellido}, {historia.pacientes.nombre}
                </p>
                <p className="text-sm text-gray-600">DNI: {historia.pacientes.documento}</p>
                <p className="text-sm text-gray-600">
                  Grupo sanguíneo: {historia.grupo_sanguineo || 'N/A'}
                </p>
                {historia.ocupacion && (
                  <p className="text-sm text-gray-500">Ocupación: {historia.ocupacion}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detalle */}
      {historiaSeleccionada && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] border border-black-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                Historia Clínica
              </h3>
              <button
                onClick={() => setHistoriaSeleccionada(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Consultas */}
            <section>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" /> Consultas
              </h4>

              {historiaSeleccionada.consultas.length ? (
                historiaSeleccionada.consultas.map((consulta) => (
                  <div
                    key={consulta.consulta_id}
                    className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50/60 hover:bg-gray-200/60 transition-colors"
                  >
                    {/* Fecha y motivo */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                      <p className="text-gray-800 font-semibold">
                        {new Date(consulta.fecha_consulta).toLocaleDateString('es-AR')}
                      </p>
                      {consulta.profesionales && (
                        <p className="text-sm text-gray-500">
                          Dr. {consulta.profesionales.usuarios.apellido} {consulta.profesionales.usuarios.nombre}
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-gray-700 space-y-1">
                      <p><span className="font-medium">Motivo:</span> {consulta.motivo_consulta}</p>
                      {consulta.enfermedad_actual && (
                        <p><span className="font-medium">Enfermedad actual:</span> {consulta.enfermedad_actual}</p>
                      )}
                      {consulta.notas_evolucion && (
                        <p><span className="font-medium">Evolución:</span> {consulta.notas_evolucion}</p>
                      )}
                    </div>

                    {/* Diagnósticos */}
                    {consulta.diagnosticos?.length ? (
                      <div className="mt-3 pl-3 border-l-2 border-gray-200 space-y-1">
                        <p className="font-semibold text-sm text-gray-800">Diagnósticos</p>
                        {consulta.diagnosticos.map((diag) => (
                          <div key={diag.diagnostico_id} className="text-sm text-gray-700">
                            {diag.juicio_clinico && <p>• Juicio: {diag.juicio_clinico}</p>}
                            {diag.indicacion_terapeutica && <p>• Terapéutica: {diag.indicacion_terapeutica}</p>}
                            {diag.pronostico && <p>• Pronóstico: {diag.pronostico}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-2">Sin diagnósticos</p>
                    )}

                    {/* Pruebas complementarias */}
                    {consulta.pruebas_complementarias?.length ? (
                      <div className="mt-3 pl-3 border-l-2 border-gray-200 space-y-1">
                        <p className="font-semibold text-sm text-gray-800">Pruebas complementarias</p>
                        {consulta.pruebas_complementarias.map((prueba) => (
                          <div key={prueba.prueba_id} className="text-sm text-gray-700">
                            <p>• {prueba.tipo_prueba.toUpperCase()}: {prueba.descripcion}</p>
                            <a
                              href={prueba.url_archivo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-500 underline"
                            >
                              Ver archivo
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-2">Sin pruebas registradas</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay consultas registradas.</p>
              )}
            </section>
          </div>
        </div>
      )}
    </main>
  );
}