import React from 'react';
import { X } from 'lucide-react';
import { AntecedentesForm } from './AntecedentesForm';
import { AntecedentesReadOnly } from './AntecedentesReadOnly';
import { HistoriaClinicaBase } from '@/lib/types';

type AntecedentesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: HistoriaClinicaBase;
  onSubmit: (data: HistoriaClinicaBase) => Promise<void>;
  isLoading: boolean;
  profesionNombre?: string;
};

export const AntecedentesModal = ({ 
  isOpen, 
  onClose, 
  data, 
  onSubmit, 
  isLoading,
  profesionNombre
}: AntecedentesModalProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  
  // Control de acceso: solo médicos clínicos pueden editar antecedentes
  const puedeEditarAntecedentes = profesionNombre === "Clínico";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header con botón cerrar */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2e75d4] to-[#8ddee1] bg-clip-text text-transparent">
            📋 Antecedentes Médicos
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Cerrar"
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
              
              <div className="mt-6 flex justify-end gap-3">
                {puedeEditarAntecedentes ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#2e75d4] to-[#6596d8] text-white font-bold rounded-lg hover:from-[#2560b8] hover:to-[#5585c7] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {data.grupo_sanguineo ? '✏️ Editar' : '📝 Completar Información'}
                  </button>
                ) : (
                  <div className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-lg">🔒</span>
                      <span>Solo el médico clínico puede editar los antecedentes</span>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};