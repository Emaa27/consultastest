'use client';

import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { ConsultaDetalle } from '@/lib/types'; // Importamos el tipo

type Props = {
    consultas: ConsultaDetalle[];
    profesionalId: number;
};

export const ConsultasList = ({ consultas, profesionalId }: Props) => {
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
            // Forzamos un refresh de la página para ver los datos actualizados.
            // Una mejor alternativa sería levantar el estado o usar una librería de gestión de estado (como SWR o React Query).
            window.location.reload();
        } catch (err: any) {
            alert('❌ ' + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-4">
            {consultas.map((c: any) => {
                const diagnostico = c.diagnosticos[0];
                // La API devuelve 'profesionales' (plural) por la relación de Prisma
                const profesionalConsulta = c.profesional || c.profesionales;
                const profesionalIdConsulta = Number(profesionalConsulta?.profesional_id);
                const profesionalIdActual = Number(profesionalId);
                const esAutor = profesionalIdConsulta === profesionalIdActual && !isNaN(profesionalIdConsulta) && !isNaN(profesionalIdActual);
                const estaEditando = editingId === c.consulta_id;

                return (
                    <div key={c.consulta_id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        <div className="flex justify-between items-start border-b pb-2 mb-2">
                            <span className="text-sm font-bold bg-gradient-to-r from-[#2e75d4] to-[#6596d8] bg-clip-text text-transparent">
                                Consulta #{c.consulta_id} - {new Date(c.fecha_consulta).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                                {profesionalConsulta?.usuarios?.nombre} {profesionalConsulta?.usuarios?.apellido}
                            </span>
                        </div>

                        <p className="text-sm text-gray-900 mb-2">
                            <strong>Motivo:</strong> {c.motivo_consulta}
                        </p>

                        {diagnostico && (
                            <>
                                <p className="text-sm font-semibold text-gray-800">
                                    Diagnóstico: {diagnostico.juicio_clinico}
                                </p>
                                {diagnostico.indicacion_terapeutica && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        <strong>Plan:</strong> {diagnostico.indicacion_terapeutica}
                                    </p>
                                )}
                            </>
                        )}

                        <div className="mt-3 pt-3 border-t">
                            <div className="flex justify-between items-center mb-2">
                                <strong className="text-xs text-gray-700">Notas de Evolución:</strong>
                                {esAutor && !estaEditando && (
                                    <button
                                        onClick={() => iniciarEdicion(c)}
                                        className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                                    >
                                        <Edit className="w-3 h-3 inline mr-1" />
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
                                            onClick={() => guardarNotas(c.consulta_id, c.historia.paciente_id)}
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
                                <p className="text-xs text-gray-600 italic">
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