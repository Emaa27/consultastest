'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react'; // Importamos el icono

type Props = {
    onSubmit: (data: any) => void;
    isLoading: boolean;
    onFinalizarConsulta?: () => void; // AGREGAR ESTA LÍNEA
    consultaCreada?: boolean; // AGREGAR ESTA LÍNEA
};

export const NuevaConsultaForm = ({ 
    onSubmit, 
    isLoading,
    onFinalizarConsulta,
    consultaCreada 
  }: Props) => {

    const [formState, setFormState] = useState({
        motivo_consulta: '',
        enfermedad_actual: '',
        pa_sistolica: '',
        pa_diastolica: '',
        temperatura: '',
        peso: '',
        altura: '',
        juicio_clinico: '',
        diagnostico_presuntivo: '',
        indicacion_terapeutica: '',
        notas_evolucion: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

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
            peso: formState.peso ? parseFloat(formState.peso) : null,
            altura: formState.altura ? parseFloat(formState.altura) : null,
        };
        
        onSubmit(payload);
        // Opcional: podrías limpiar el formulario después de enviar
        // setFormState({ ...initialState });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-base font-semibold text-gray-700">Anamnesis</h3>
            <textarea name="motivo_consulta" placeholder="Motivo de Consulta *" value={formState.motivo_consulta} onChange={handleChange} rows={2} required className="w-full p-2 border rounded" />
            <textarea name="enfermedad_actual" placeholder="Enfermedad Actual" value={formState.enfermedad_actual} onChange={handleChange} rows={3} className="w-full p-2 border rounded" />

            <h3 className="text-base font-semibold text-gray-700 pt-2">Exploración Física</h3>
            <div className="grid grid-cols-2 gap-2">
                <input type="number" name="pa_sistolica" placeholder="PA Sist." value={formState.pa_sistolica} onChange={handleChange} className="p-2 border rounded" />
                <input type="number" name="pa_diastolica" placeholder="PA Diast." value={formState.pa_diastolica} onChange={handleChange} className="p-2 border rounded" />
                <input type="number" step="0.1" name="temperatura" placeholder="Temp. °C" value={formState.temperatura} onChange={handleChange} className="p-2 border rounded" />
                <input type="number" step="0.1" name="peso" placeholder="Peso Kg" value={formState.peso} onChange={handleChange} className="p-2 border rounded" />
                <input type="number" step="0.01" name="altura" placeholder="Altura m" value={formState.altura} onChange={handleChange} className="p-2 border rounded col-span-2" />
            </div>

            <h3 className="text-base font-semibold text-gray-700 pt-2">Diagnóstico</h3>
            <textarea name="juicio_clinico" placeholder="Juicio Clínico *" value={formState.juicio_clinico} onChange={handleChange} rows={2} required className="w-full p-2 border rounded" />
            <textarea name="diagnostico_presuntivo" placeholder="Diagnóstico Presuntivo" value={formState.diagnostico_presuntivo} onChange={handleChange} rows={2} className="w-full p-2 border rounded" />
            <textarea name="indicacion_terapeutica" placeholder="Plan Terapéutico" value={formState.indicacion_terapeutica} onChange={handleChange} rows={3} className="w-full p-2 border rounded" />
            
            <h3 className="text-base font-semibold text-gray-700 pt-2">Notas de Evolución</h3>
            <textarea name="notas_evolucion" placeholder="Observaciones" value={formState.notas_evolucion} onChange={handleChange} rows={3} className="w-full p-2 border rounded" />
            <button
                type="submit"
                disabled={isLoading || consultaCreada}
                className="w-full py-3 bg-gradient-to-r from-[#6596d8] to-[#8ddee1] text-white font-bold rounded-lg hover:from-[#5585c7] hover:to-[#7dcdd0] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
                {isLoading ? 'Registrando...' : <><Save className="w-5 h-5" /> Registrar Consulta</>}
            </button>
            {consultaCreada && onFinalizarConsulta && (
                <button
                    type="button"
                    onClick={onFinalizarConsulta}
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                    ✅ Finalizar Consulta y Marcar Turno como Atendido
                </button>
            )}
        </form>
    );
};