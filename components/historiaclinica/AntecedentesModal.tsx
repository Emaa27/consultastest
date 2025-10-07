import React from 'react';
import { X } from 'lucide-react';
import { AntecedentesForm } from './AntecedentesForm';
import { AntecedentesReadOnly } from './AntecedentesReadOnly';

type HistoriaClinicaBase = {
  historia_id: number;
  paciente_id: number;
  medico_cabecera_id: number | null;
  sexo: string | null;
  grupo_sanguineo: string | null;
  estado_civil: string | null;
  ocupacion: string | null;
  enfermedades_infancia: string | null;
  enfermedades_cronicas: string | null;
  cirugias: string | null;
  alergias: string | null;
  medicamentos_actuales: string | null;
  consume_tabaco: boolean;
  consume_alcohol: boolean;
  actividad_fisica: string | null;
};

type AntecedentesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: HistoriaClinicaBase;
  onSubmit: (data: HistoriaClinicaBase) => void;
  isLoading: boolean;
};

export const AntecedentesModal = ({ isOpen, onClose, data, onSubmit, isLoading }: AntecedentesModalProps) => {
  const [isEditing, setIsEditing] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">📋 Antecedentes y Filiación</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isEditing ? (
            <AntecedentesForm
              initialData={data}
              onSubmit={(formData) => {
                onSubmit(formData);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
              isLoading={isLoading}
            />
          ) : (
            <>
              <AntecedentesReadOnly data={data} />
              <div className="mt-6 flex justify-end">
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#2e75d4] to-[#6596d8] text-white font-bold rounded-lg hover:from-[#2560b8] hover:to-[#5585c7] transition-all shadow-lg"
                    >
                    {data.grupo_sanguineo ? 'Editar' : 'Completar Información'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};