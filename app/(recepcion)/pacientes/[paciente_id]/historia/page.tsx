'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { User, Clock } from 'lucide-react';
import { AntecedentesModal } from '@/components/historiaclinica/AntecedentesModal';
import { NuevaConsultaModal } from '@/components/historiaclinica/NuevaConsultaModal';
import { ConsultasList } from '@/components/historiaclinica/ConsultasList';

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
  medico_cabecera?: {
    profesional_id: number;
    usuarios: {
      nombre: string;
      apellido: string;
      email: string;
    };
  };
};

type DiagnosticoDetalle = {
  diagnostico_id: number;
  juicio_clinico: string;
  diagnostico_presuntivo: string | null;
  indicacion_terapeutica: string | null;
}

type ConsultaDetalle = {
  consulta_id: number;
  fecha_consulta: string;
  motivo_consulta: string;
  enfermedad_actual: string | null;
  pa_sistolica: number | null;
  pa_diastolica: number | null;
  temperatura: number | null;
  peso: number | null;
  altura: number | null;
  notas_evolucion: string | null;
  diagnosticos: DiagnosticoDetalle[];
  profesional: { 
    profesional_id: number;
    usuarios: {
      nombre: string;
      apellido: string;
    }
  };
  historia: {
    paciente_id: number;
  };
};

type HistoriaClinicaCompleta = HistoriaClinicaBase & {
  consultas: ConsultaDetalle[];
  pacientes?: {
    nombre: string;
    apellido: string;
    documento: string;
    fecha_nacimiento: string | null;
    genero: string | null;
    email: string | null;
    telefono: string | null;
  };
};

const PROFESIONAL_ID = 9;

export default function HistoriaClinicaPage({ 
  params 
}: { 
  params: Promise<{ paciente_id: string }> 
}) {
  const resolvedParams = use(params);
  const pacienteId = parseInt(resolvedParams.paciente_id);
  
  const [hcData, setHcData] = useState<HistoriaClinicaCompleta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  // Estados para modales
  const [showAntecedentesModal, setShowAntecedentesModal] = useState(false);
  const [showConsultaModal, setShowConsultaModal] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);

  const cargarHistoriaClinica = useCallback(async () => {
    if (isNaN(pacienteId)) {
      setError('ID de paciente no válido.');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/historiaclinica/${pacienteId}`);
      
      if (res.status === 404) {
        const createRes = await fetch(`/api/historiaclinica/crearhc`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paciente_id: pacienteId }),
        });
        
        if (!createRes.ok) {
          throw new Error('No se pudo crear la Historia Clínica');
        }
        
        const retryRes = await fetch(`/api/historiaclinica/${pacienteId}`);
        if (!retryRes.ok) throw new Error('Error al cargar la Historia Clínica');
        const data: HistoriaClinicaCompleta = await retryRes.json();
        setHcData(data);
        return;
      }
      
      if (!res.ok) throw new Error('Error al cargar la Historia Clínica');
      
      const data: HistoriaClinicaCompleta = await res.json();
      setHcData(data);
      
    } catch (err: any) {
      setError(err.message || 'Error al obtener los datos de la HC.');
    } finally {
      setIsLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    cargarHistoriaClinica();
  }, [cargarHistoriaClinica]);
  
  const handleActualizarAntecedentes = async (formData: HistoriaClinicaBase) => {
    if (!hcData) return;
    setIsFormLoading(true);

    try {
      const res = await fetch(`/api/historiaclinica/${pacienteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Falló la actualización de antecedentes');
      
      setHcData(prev => ({
        ...prev!, 
        ...formData,
      }));
      setShowAntecedentesModal(false);
      alert('✅ Antecedentes guardados con éxito.');
      
    } catch (err) {
      alert('❌ Error al guardar: ' + (err as Error).message);
    } finally {
      setIsFormLoading(false);
    }
  };
  
  const handleGuardarNuevaConsulta = async (formData: any) => {
    if (!hcData) return;
    setIsFormLoading(true);
    
    const payload = {
      ...formData,
      historia_id: hcData.historia_id,
      profesional_id: PROFESIONAL_ID,
    };
    
    try {
      const res = await fetch(`/api/historiaclinica/${pacienteId}/consulta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falló el registro de la consulta');
      }
      
      alert('✅ Consulta registrada con éxito.');
      setShowConsultaModal(false);
      await cargarHistoriaClinica(); 
      
    } catch (err) {
      alert('❌ Error al registrar la consulta: ' + (err as Error).message);
    } finally {
      setIsFormLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-lg">Cargando Historia Clínica...</div>;
  if (error) return <div className="p-8 text-center text-xl text-red-600">Error: {error}</div>;
  if (!hcData) return <div className="p-8 text-center text-xl text-gray-500">Historia Clínica no encontrada.</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header con información del paciente */}
      <div className="bg-gradient-to-r from-[#2e75d4] to-[#8ddee1] text-white rounded-xl shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {hcData.pacientes ? 
                  `${hcData.pacientes.nombre} ${hcData.pacientes.apellido}` : 
                  `Paciente ID: ${pacienteId}`
                }
              </h1>
              {hcData.pacientes && (
                <div className="mt-2 space-y-1 text-white/90">
                  <p className="text-sm">
                    <strong>DNI:</strong> {hcData.pacientes.documento} | 
                    <strong className="ml-3">Género:</strong> {hcData.pacientes.genero || 'N/A'} |
                    <strong className="ml-3">Fecha Nac.:</strong> {hcData.pacientes.fecha_nacimiento ? new Date(hcData.pacientes.fecha_nacimiento).toLocaleDateString('es-AR') : 'N/A'}
                  </p>
                  <p className="text-sm">
                    {hcData.pacientes.email && (
                      <><strong>Email:</strong> {hcData.pacientes.email} | </>
                    )}
                    {hcData.pacientes.telefono && (
                      <><strong>Tel:</strong> {hcData.pacientes.telefono}</>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 text-right">
            <p className="text-xs text-white/70 uppercase font-semibold">Profesional Actual</p>
            <p className="text-sm font-medium mt-1">ID: {PROFESIONAL_ID}</p>
          </div>
        </div>
      </div>

      {/* Banner médico de cabecera */}
      {hcData.medico_cabecera && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Médico de Cabecera:</strong> Dr/a. {hcData.medico_cabecera.usuarios.nombre} {hcData.medico_cabecera.usuarios.apellido}
            {hcData.medico_cabecera.usuarios.email && (
              <> • <strong>Email:</strong> {hcData.medico_cabecera.usuarios.email}</>
            )}
          </p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-4">
  <button
    onClick={() => setShowAntecedentesModal(true)}
    className="flex-1 py-4 bg-gradient-to-r from-[#2e75d4] to-[#6596d8] text-white font-bold rounded-lg hover:from-[#2560b8] hover:to-[#5585c7] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
  >
    📋 {hcData.grupo_sanguineo ? 'Ver/Editar Antecedentes' : 'Completar Antecedentes'}
  </button>
  
  <button
    onClick={() => setShowConsultaModal(true)}
    className="flex-1 py-4 bg-gradient-to-r from-[#6596d8] to-[#8ddee1] text-white font-bold rounded-lg hover:from-[#5585c7] hover:to-[#7dcdd0] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
  >
    ➕ Registrar Nueva Consulta
  </button>
</div>
      
     {/* Historial de Consultas - Desplegable */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={() => setShowHistorial(!showHistorial)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-gray-600" /> 
            Historial de Consultas ({hcData.consultas.length})
          </h2>
          <span className={`text-2xl transform transition-transform ${showHistorial ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {showHistorial && (
          <div className="p-6 pt-0 border-t">
            {hcData.consultas.length === 0 ? (
              <p className="text-gray-500">Este paciente aún no tiene consultas registradas.</p>
            ) : (
              <ConsultasList consultas={hcData.consultas} />
            )}
          </div>
        )}
      </div>

      {/* Modales */}
      <AntecedentesModal
        isOpen={showAntecedentesModal}
        onClose={() => setShowAntecedentesModal(false)}
        data={hcData}
        onSubmit={handleActualizarAntecedentes}
        isLoading={isFormLoading}
      />

      <NuevaConsultaModal
        isOpen={showConsultaModal}
        onClose={() => setShowConsultaModal(false)}
        onSubmit={handleGuardarNuevaConsulta}
        isLoading={isFormLoading}
      />
    </div>
  );
}