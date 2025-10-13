import React from 'react';
import { X } from 'lucide-react';
import { NuevaConsultaForm } from './NuevaConsultaForm';

type NuevaConsultaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onFinalizarConsulta?: () => void; // AGREGAR
  consultaCreada?: boolean; // AGREGAR
};


export const NuevaConsultaModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading,
  onFinalizarConsulta, // AGREGAR
  consultaCreada // AGREGAR
}: NuevaConsultaModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2e75d4] to-[#8ddee1] bg-clip-text text-transparent"> ➕ Registrar Diagnóstico/Prácticas médicas</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

          <div className="p-6">
          <NuevaConsultaForm 
            onSubmit={onSubmit} 
            isLoading={isLoading}
            onFinalizarConsulta={onFinalizarConsulta} // AGREGAR
            consultaCreada={consultaCreada} // AGREGAR
          />
        </div>
      </div>
    </div>
  );
};