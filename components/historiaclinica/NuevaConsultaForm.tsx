'use client';

import React, { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';

type Props = {
    onSubmit: (data: any) => void;
    isLoading: boolean;
    onFinalizarConsulta?: () => void;
    consultaCreada?: boolean;
};

export const NuevaConsultaForm = ({ 
    onSubmit, 
    isLoading,
    onFinalizarConsulta,
    consultaCreada 
}: Props) => {
    // Estados del formulario básico
    const [formState, setFormState] = useState({
        motivo_consulta: '',
        enfermedad_actual: '',
        pa_sistolica: '',
        pa_diastolica: '',
        temperatura: '',
        juicio_clinico: '',
        diagnostico_presuntivo: '',
        indicacion_terapeutica: '',
        notas_evolucion: '',
        observaciones: '', // Observaciones para el recepcionista
    });

    // Estados para medicamentos
    const [medicamentos, setMedicamentos] = useState<Array<{
        droga: string;
        via_administracion: string;
        dosis: string;
        frecuencia: string;
    }>>([]);

    // Estados para derivación
    const [requiereDerivacion, setRequiereDerivacion] = useState(false);
    const [especialidadDerivacion, setEspecialidadDerivacion] = useState('');

    // Handlers básicos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    // Handlers para medicamentos
    const agregarMedicamento = () => {
        setMedicamentos([...medicamentos, {
            droga: '',
            via_administracion: 'oral',
            dosis: '',
            frecuencia: ''
        }]);
    };

    const eliminarMedicamento = (index: number) => {
        setMedicamentos(medicamentos.filter((_, i) => i !== index));
    };

    const actualizarMedicamento = (index: number, campo: string, valor: string) => {
        const nuevos = [...medicamentos];
        nuevos[index] = { ...nuevos[index], [campo]: valor };
        setMedicamentos(nuevos);
    };

    // Submit del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formState.motivo_consulta || !formState.juicio_clinico) {
            alert('El Motivo de Consulta y el Juicio Clínico son requeridos.');
            return;
        }
        
        const payload = {
            ...formState,
            pa_sistolica: formState.pa_sistolica ? parseFloat(formState.pa_sistolica) : null,
            pa_diastolica: formState.pa_diastolica ? parseFloat(formState.pa_diastolica) : null,
            temperatura: formState.temperatura ? parseFloat(formState.temperatura) : null,
            requiere_derivacion: requiereDerivacion,
            especialidad_derivacion: requiereDerivacion ? especialidadDerivacion : null,
            medicamentos: medicamentos.filter(m => m.droga.trim() !== '')
        };
        
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Anamnesis */}
            <h3 className="text-base font-semibold text-gray-700">Anamnesis</h3>
            <textarea 
                name="motivo_consulta" 
                placeholder="Motivo *" 
                value={formState.motivo_consulta} 
                onChange={handleChange} 
                rows={2} 
                required 
                className="w-full p-2 border rounded" 
            />
            <textarea 
                name="enfermedad_actual" 
                placeholder="Enfermedad Actual" 
                value={formState.enfermedad_actual} 
                onChange={handleChange} 
                rows={3} 
                className="w-full p-2 border rounded" 
            />

            {/* Exploración Física */}
            <h3 className="text-base font-semibold text-gray-700 pt-2">Exploración Física</h3>
            <div className="grid grid-cols-2 gap-2">
                <input 
                    type="number" 
                    name="pa_sistolica" 
                    placeholder="PA Sist." 
                    value={formState.pa_sistolica} 
                    onChange={handleChange} 
                    className="p-2 border rounded" 
                />
                <input 
                    type="number" 
                    name="pa_diastolica" 
                    placeholder="PA Diast." 
                    value={formState.pa_diastolica} 
                    onChange={handleChange} 
                    className="p-2 border rounded" 
                />
                <input 
                    type="number" 
                    step="0.1" 
                    name="temperatura" 
                    placeholder="Temp. °C" 
                    value={formState.temperatura} 
                    onChange={handleChange} 
                    className="p-2 border rounded col-span-2" 
                />
            </div>

            {/* Diagnóstico */}
            <h3 className="text-base font-semibold text-gray-700 pt-2">Diagnóstico</h3>
            <textarea 
                name="juicio_clinico" 
                placeholder="Juicio Clínico *" 
                value={formState.juicio_clinico} 
                onChange={handleChange} 
                rows={2} 
                required 
                className="w-full p-2 border rounded" 
            />
            <textarea 
                name="diagnostico_presuntivo" 
                placeholder="Diagnóstico Presuntivo" 
                value={formState.diagnostico_presuntivo} 
                onChange={handleChange} 
                rows={2} 
                className="w-full p-2 border rounded" 
            />
            <textarea 
                name="indicacion_terapeutica" 
                placeholder="Plan Terapéutico" 
                value={formState.indicacion_terapeutica} 
                onChange={handleChange} 
                rows={3} 
                className="w-full p-2 border rounded" 
            />

            {/* Derivación */}
            <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                    <input
                        type="checkbox"
                        id="requiere_derivacion"
                        checked={requiereDerivacion}
                        onChange={(e) => setRequiereDerivacion(e.target.checked)}
                        className="w-4 h-4 text-[#2e75d4]"
                    />
                    <label htmlFor="requiere_derivacion" className="text-sm font-semibold text-gray-700">
                        Requiere Derivación a Especialista
                    </label>
                </div>
                
                {requiereDerivacion && (
                    <select
                        value={especialidadDerivacion}
                        onChange={(e) => setEspecialidadDerivacion(e.target.value)}
                        className="w-full p-2 border rounded"
                        required={requiereDerivacion}
                    >
                        <option value="">Seleccione especialidad...</option>
                        <option value="Cardiología">Cardiología</option>
                        <option value="Nutrición">Nutrición</option>
                        <option value="Dermatología">Dermatología</option>
                        <option value="Traumatología">Traumatología</option>
                        <option value="Oftalmología">Oftalmología</option>
                        <option value="Otorrinolaringología">Otorrinolaringología</option>
                        <option value="Neurología">Neurología</option>
                        <option value="Psiquiatría">Psiquiatría</option>
                        <option value="Otra">Otra</option>
                    </select>
                )}
            </div>

            {/* Medicamentos */}
            <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold text-gray-700">Prescripción de Medicamentos</h3>
                    <button
                        type="button"
                        onClick={agregarMedicamento}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                        + Agregar Medicamento
                    </button>
                </div>

                {medicamentos.map((med, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Medicamento {index + 1}</span>
                            <button
                                type="button"
                                onClick={() => eliminarMedicamento(index)}
                                className="text-red-500 text-xs hover:text-red-700 flex items-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" />
                                Eliminar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder="Nombre del medicamento / Droga"
                                value={med.droga}
                                onChange={(e) => actualizarMedicamento(index, 'droga', e.target.value)}
                                className="p-2 border rounded text-sm"
                            />
                            
                            <select
                                value={med.via_administracion}
                                onChange={(e) => actualizarMedicamento(index, 'via_administracion', e.target.value)}
                                className="p-2 border rounded text-sm"
                            >
                                <option value="oral">Vía Oral</option>
                                <option value="inyectable">Inyectable</option>
                                <option value="topica">Tópica</option>
                                <option value="intravenosa">Intravenosa</option>
                                <option value="intramuscular">Intramuscular</option>
                                <option value="subcutanea">Subcutánea</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Dosis (ej: 500mg)"
                                value={med.dosis}
                                onChange={(e) => actualizarMedicamento(index, 'dosis', e.target.value)}
                                className="p-2 border rounded text-sm"
                            />

                            {med.via_administracion === 'oral' && (
                                <input
                                    type="text"
                                    placeholder="Frecuencia (ej: Cada 8 horas)"
                                    value={med.frecuencia}
                                    onChange={(e) => actualizarMedicamento(index, 'frecuencia', e.target.value)}
                                    className="p-2 border rounded text-sm"
                                />
                            )}
                        </div>
                    </div>
                ))}

                {medicamentos.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No se prescribieron medicamentos</p>
                )}
            </div>

            {/* Notas de Evolución */}
            <h3 className="text-base font-semibold text-gray-700 pt-2">Notas de Evolución</h3>
            <textarea
                name="notas_evolucion"
                placeholder="Observaciones médicas internas"
                value={formState.notas_evolucion}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded"
            />

            {/* Observaciones para Recepción */}
            <div className="border-t pt-4 mt-4">
                <h3 className="text-base font-semibold text-gray-700">
                    Observaciones para Recepción
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                    Estas observaciones serán visibles para el personal de recepción cuando el turno esté atendido
                </p>
                <textarea
                    name="observaciones"
                    placeholder="Ej: Requiere seguimiento telefónico, Solicitar estudios previos en próxima consulta, etc."
                    value={formState.observaciones}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
                />
            </div>

            {/* Botón Submit */}
            <button
                type="submit"
                disabled={isLoading || consultaCreada}
                className="w-full py-3 bg-gradient-to-r from-[#6596d8] to-[#8ddee1] text-white font-bold rounded-lg hover:from-[#5585c7] hover:to-[#7dcdd0] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
                {isLoading ? 'Registrando...' : <><Save className="w-5 h-5" /> Registrar Prácticas médicas/ diagnósticos</>}
            </button>

            {/* Botón Finalizar Consulta */}
            {consultaCreada && onFinalizarConsulta && (
                <button
                    type="button"
                    onClick={onFinalizarConsulta}
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                    ✅ Finalizar Turno y Marcar como Atendido
                </button>
            )}
        </form>
    );
};