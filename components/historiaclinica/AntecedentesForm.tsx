'use client';
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { HistoriaClinicaBase } from '@/lib/types'; // Importamos el tipo

type Props = {
  initialData: HistoriaClinicaBase;
  onSubmit: (data: HistoriaClinicaBase) => void;
  onCancel: () => void;
  isLoading: boolean;
};

export const AntecedentesForm = ({ initialData, onSubmit, onCancel, isLoading }: Props) => {
    const [formState, setFormState] = useState<HistoriaClinicaBase>(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormState({ ...formState, [name]: newValue });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formState);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
            {/* ... El resto del JSX del formulario (igual que en el archivo original) ... */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Sexo Biológico</label>
                   <select name="sexo" value={formState.sexo || ''} onChange={handleChange} className="w-full p-2 border rounded">
                       <option value="">Seleccione...</option>
                       <option value="Masculino">Masculino</option>
                       <option value="Femenino">Femenino</option>
                   </select>
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Grupo Sanguíneo</label>
                   <select name="grupo_sanguineo" value={formState.grupo_sanguineo || ''} onChange={handleChange} className="w-full p-2 border rounded">
                       <option value="">Seleccione...</option>
                       <option value="A+">A+</option>
                       <option value="A-">A-</option>
                       <option value="B+">B+</option>
                       <option value="B-">B-</option>
                       <option value="AB+">AB+</option>
                       <option value="AB-">AB-</option>
                       <option value="O+">O+</option>
                       <option value="O-">O-</option>
                   </select>
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input type="text" name="estado_civil" placeholder="Estado Civil" value={formState.estado_civil || ''} onChange={handleChange} className="p-2 border rounded" />
               <input type="text" name="ocupacion" placeholder="Ocupación" value={formState.ocupacion || ''} onChange={handleChange} className="p-2 border rounded" />
           </div>

           <textarea name="alergias" placeholder="Alergias (separadas por coma)" value={formState.alergias || ''} onChange={handleChange} rows={2} className="w-full p-2 border rounded" />
           <textarea name="enfermedades_cronicas" placeholder="Enfermedades Crónicas" value={formState.enfermedades_cronicas || ''} onChange={handleChange} rows={2} className="w-full p-2 border rounded" />
           <textarea name="cirugias" placeholder="Cirugías Previas" value={formState.cirugias || ''} onChange={handleChange} rows={2} className="w-full p-2 border rounded" />
           <textarea name="medicamentos_actuales" placeholder="Medicación Actual" value={formState.medicamentos_actuales || ''} onChange={handleChange} rows={2} className="w-full p-2 border rounded" />
           
           <div className="space-y-3">
               <div className="flex items-center space-x-6">
                   <div className="flex items-center">
                       <input id="tabaco" type="checkbox" name="consume_tabaco" checked={formState.consume_tabaco} onChange={handleChange} className="w-4 h-4 text-[#2e75d4]" />
                       <label htmlFor="tabaco" className="ml-2 text-sm font-medium text-gray-900">Consume Tabaco</label>
                   </div>
                   <div className="flex items-center">
                       <input id="alcohol" type="checkbox" name="consume_alcohol" checked={formState.consume_alcohol} onChange={handleChange} className="w-4 h-4 text-[#2e75d4]" />
                       <label htmlFor="alcohol" className="ml-2 text-sm font-medium text-gray-900">Consume Alcohol</label>
                   </div>
               </div>

               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Actividad Física</label>
                   <select 
                       name="actividad_fisica" 
                       value={formState.actividad_fisica || ''} 
                       onChange={handleChange} 
                       className="w-full p-2 border rounded"
                   >
                       <option value="">Seleccione...</option>
                       <option value="sedentario">Sedentario</option>
                       <option value="ligera">Ligera</option>
                       <option value="moderada">Moderada</option>
                       <option value="intensa">Intensa</option>
                   </select>
               </div>
           </div>

           <div className="flex gap-4 justify-end pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-[#2e75d4] to-[#6596d8] text-white rounded-lg hover:from-[#2560b8] hover:to-[#5585c7] transition-all flex items-center gap-1 disabled:opacity-50 shadow-md"
                    >
                    {isLoading ? ('Guardando...') : (<><Save className="w-4 h-4" /> Guardar</>    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                    <X className="w-4 h-4" /> Cancelar
                    </button>
                </div>
        </form>
    );
};