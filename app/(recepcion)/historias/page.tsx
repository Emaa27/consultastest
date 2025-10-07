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

  useEffect(() => {
    const fetchHistorias = async () => {
      try {
        const res = await fetch('/api/historias');
        const data = await res.json();
        setHistorias(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistorias();
  }, []);

  return (
    <main className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white rounded-2xl p-6 shadow-md border border-orange-100 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Historias Clínicas</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-400" />
            <span className="font-semibold">Vista profesional</span>
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-400" />
          Pacientes con historia clínica
        </h3>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Cargando historias...</div>
        ) : historias.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay historias clínicas registradas.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historias.map((historia) => (
              <div
                key={historia.historia_id}
                onClick={() => setHistoriaSeleccionada(historia)}
                className="p-5 rounded-xl bg-gradient-to-r from-orange-100/60 to-yellow-100/50
                           hover:from-orange-200/60 hover:to-yellow-200/60 cursor-pointer
                           border border-orange-200 transition-all duration-300 hover:shadow-xl"
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] border border-orange-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg">
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

            {/* Datos del paciente */}
              <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                Datos del paciente
              </h4>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="font-semibold text-gray-800 text-lg">
                  {historiaSeleccionada.pacientes.apellido}, {historiaSeleccionada.pacientes.nombre}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm text-gray-700 mt-2">
                  <p><strong>DNI:</strong> {historiaSeleccionada.pacientes.documento}</p>
                  <p><strong>Sexo:</strong> {historiaSeleccionada.sexo || 'No registrado'}</p>
                  <p><strong>Grupo sanguíneo:</strong> {historiaSeleccionada.grupo_sanguineo || 'No registrado'}</p>
                  <p><strong>Estado civil:</strong> {historiaSeleccionada.estado_civil || 'No especificado'}</p>
                  <p><strong>Ocupación:</strong> {historiaSeleccionada.ocupacion || 'No registrada'}</p>
                </div>
              </div>

              {/* Secciones médicas */}
              <section className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-400" />
                  Antecedentes Médicos y Hábitos
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700 bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <p><span className="font-medium">Enfermedades de la infancia:</span> {historiaSeleccionada.enfermedades_infancia || 'No registradas'}</p>
                  <p><span className="font-medium">Enfermedades crónicas:</span> {historiaSeleccionada.enfermedades_cronicas || 'No registradas'}</p>
                  <p><span className="font-medium">Cirugías:</span> {historiaSeleccionada.cirugias || 'No registradas'}</p>
                  <p><span className="font-medium">Hospitalizaciones:</span> {historiaSeleccionada.hospitalizaciones || 'No registradas'}</p>
                  <p><span className="font-medium">Traumatismos:</span> {historiaSeleccionada.traumatismos || 'No registrados'}</p>
                  <p><span className="font-medium">Medicamentos actuales:</span> {historiaSeleccionada.medicamentos_actuales || 'No registrados'}</p>

                  <p><span className="font-medium">Consume tabaco:</span> {historiaSeleccionada.consume_tabaco ? 'Sí' : 'No'}</p>
                  <p><span className="font-medium">Consume alcohol:</span> {historiaSeleccionada.consume_alcohol ? 'Sí' : 'No'}</p>
                  <p><span className="font-medium">Otras sustancias:</span> {historiaSeleccionada.otras_sustancias || 'No registradas'}</p>
                  <p><span className="font-medium">Dieta adecuada:</span> {historiaSeleccionada.dieta_ok ? 'Sí' : 'No'}</p>

                  {historiaSeleccionada.actividad_fisica?.descripcion && (
                    <p><span className="font-medium">Actividad física:</span> {historiaSeleccionada.actividad_fisica.descripcion}</p>
                  )}
                  {historiaSeleccionada.habitos_sueno?.descripcion && (
                    <p><span className="font-medium">Hábitos de sueño:</span> {historiaSeleccionada.habitos_sueno.descripcion}</p>
                  )}
                  {historiaSeleccionada.alergias && (
                    <p><span className="font-medium">Alergias:</span> {historiaSeleccionada.alergias}</p>
                  )}
                </div>
              </section>


              {/* Consultas */}
              <section>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" /> Consultas
                </h4>

                {historiaSeleccionada.consultas.length ? (
                  historiaSeleccionada.consultas.map((consulta) => (
                    <div
                      key={consulta.consulta_id}
                      className="border border-orange-100 rounded-xl p-4 mb-4 bg-orange-50/60 hover:bg-orange-100/60 transition-colors"
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
                        <div className="mt-3 pl-3 border-l-2 border-orange-400 space-y-1">
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
                        <div className="mt-3 pl-3 border-l-2 border-yellow-400 space-y-1">
                          <p className="font-semibold text-sm text-gray-800">Pruebas complementarias</p>
                          {consulta.pruebas_complementarias.map((prueba) => (
                            <div key={prueba.prueba_id} className="text-sm text-gray-700">
                              <p>• {prueba.tipo_prueba.toUpperCase()}: {prueba.descripcion}</p>
                              <a href={prueba.url_archivo} target="_blank" className="text-orange-500 underline">
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
