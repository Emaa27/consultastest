'use client';

import React from 'react';
import { HistoriaClinicaBase } from '@/lib/types'; // Importamos el tipo

type Props = {
  data: HistoriaClinicaBase;
};

export const AntecedentesReadOnly = ({ data }: Props) => {
    const fields = [
        { label: "Sexo Biológico", value: data.sexo },
        { label: "Grupo Sanguíneo", value: data.grupo_sanguineo },
        { label: "Estado Civil", value: data.estado_civil },
        { label: "Ocupación", value: data.ocupacion },
        { label: "Tabaco", value: data.consume_tabaco ? 'Sí' : 'No' },
        { label: "Alcohol", value: data.consume_alcohol ? 'Sí' : 'No' },
        { label: "Actividad Física", value: data.actividad_fisica },
        { label: "Alergias", value: data.alergias },
        { label: "Enfermedades Crónicas", value: data.enfermedades_cronicas },
        { label: "Cirugías Previas", value: data.cirugias },
        { label: "Medicación Actual", value: data.medicamentos_actuales },
    ];
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {fields.map((field, index) => (
                <div key={index} className="border-b pb-2">
                    <p className="text-xs font-semibold uppercase text-[#2e75d4]">{field.label}</p>
                    <p className="text-sm text-gray-800">{field.value || '— No especificado'}</p>
                </div>
            ))}
        </div>
    );
};