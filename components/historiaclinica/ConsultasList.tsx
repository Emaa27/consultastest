'use client';

import React, { useState } from 'react';
import { Edit, Pill, Stethoscope } from 'lucide-react';
import { ConsultaDetalle } from '@/lib/types';

type Props = {
  consultas: ConsultaDetalle[];
  profesionalId: number;
  pacienteId: number;
};

export const ConsultasList = ({ consultas, profesionalId, pacienteId }: Props) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [notasTemp, setNotasTemp] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const iniciarEdicion = (consulta: ConsultaDetalle) => {
    setEditingId(consulta.consulta_id);
    setNotasTemp(consulta.notas_evolucion || '');
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setNotasTemp('');
  };

  const guardarNotas = async (consultaId: number, pacienteId: number) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/historiaclinica/${pacienteId}/consulta/${consultaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas_evolucion: notasTemp }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar');
      }

      alert('✅ Notas actualizadas correctamente');
      setEditingId(null);
      window.location.reload();
    } catch (err: any) {
      alert('❌ ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {consultas.map((c) => {
        const diagnostico = c.diagnosticos?.[0];
        const profesionalConsulta = c.profesionales;
        const profesionalIdConsulta = Number(profesionalConsulta?.profesional_id);
        const profesionalIdActual = Number(profesionalId);
        const esAutor = profesionalIdConsulta === profesionalIdActual && 
                       !isNaN(profesionalIdConsulta) && 
                       !isNaN(profesionalIdActual);
        const estaEditando = editingId === c.consulta_id;

        return (
          <div 
            key={c.consulta_id} 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            {/* Header de la consulta */}
            <div className="flex justify-between items-start border-b pb-2 mb-3">
              <span className="text-sm font-bold bg-gradient-to-r from-[#2e75d4] to-[#6596d8] bg-clip-text text-transparent">
                Consulta #{c.consulta_id} - {new Date(c.fecha_consulta).toLocaleDateString('es-AR')}
              </span>
              {profesionalConsulta && (
                <span className="text-xs text-gray-500">
                  Dr. {profesionalConsulta.usuarios.apellido}
                </span>
              )}
            </div>

            {/* Motivo de consulta */}
            <p className="text-sm text-gray-900 mb-3">
              <strong>Motivo:</strong> {c.motivo_consulta}
            </p>

            {/* Diagnóstico */}
            {diagnostico && (
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Diagnóstico: {diagnostico.juicio_clinico}
                  </p>
                  {diagnostico.indicacion_terapeutica && (
                    <p className="text-xs text-blue-800">
                      <strong>Plan:</strong> {diagnostico.indicacion_terapeutica}
                    </p>
                  )}
                </div>

                {/* Derivación */}
                {diagnostico.requiere_derivacion && diagnostico.especialidad_derivacion && (
                  <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400 flex items-start gap-2">
                    <Stethoscope className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900">
                        Derivación a Especialista
                      </p>
                      <p className="text-xs text-yellow-800">
                        {diagnostico.especialidad_derivacion}
                      </p>
                    </div>
                  </div>
                )}

                {/* Prescripción de Medicamentos */}
                {diagnostico.medicamentos && diagnostico.medicamentos.length > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-semibold text-green-900">
                        Prescripción de Medicamentos ({diagnostico.medicamentos.length})
                      </p>
                    </div>
                    <div className="space-y-2">
                      {diagnostico.medicamentos.map((med, idx) => (
                        <div 
                          key={med.medicamento_id} 
                          className="bg-white p-3 rounded border border-green-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {idx + 1}. {med.droga}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Vía:</span>
                                  <span className="capitalize">{med.via_administracion}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Dosis:</span>
                                  <span>{med.dosis}</span>
                                </span>
                                {med.frecuencia && (
                                  <span className="flex items-center gap-1">
                                    <span className="font-medium">Frecuencia:</span>
                                    <span>{med.frecuencia}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notas de Evolución */}
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center mb-2">
                <strong className="text-xs text-gray-700">Notas de Evolución:</strong>
                {esAutor && !estaEditando && (
                  <button
                    onClick={() => iniciarEdicion(c)}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Editar
                  </button>
                )}
              </div>

              {estaEditando ? (
                <div className="space-y-2">
                  <textarea
                    value={notasTemp}
                    onChange={(e) => setNotasTemp(e.target.value)}
                    rows={3}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Agregar notas de evolución..."
                    disabled={isUpdating}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => guardarNotas(c.consulta_id, pacienteId)}
                      disabled={isUpdating}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {isUpdating ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      disabled={isUpdating}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded">
                  {c.notas_evolucion || 'Sin notas registradas'}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};