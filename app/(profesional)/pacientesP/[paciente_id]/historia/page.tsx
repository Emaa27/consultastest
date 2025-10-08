'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { User, Clock, X, CheckCircle } from 'lucide-react';
import { AntecedentesModal } from '@/components/historiaclinica/AntecedentesModal';
import { NuevaConsultaModal } from '@/components/historiaclinica/NuevaConsultaModal';
import { ConsultasList } from '@/components/historiaclinica/ConsultasList';
import { HistoriaClinicaBase, HistoriaClinicaCompleta } from '@/lib/types';
// ... todos tus types existentes ...

// CAMBIAR ESTA LÍNEA:
// const PROFESIONAL_ID = 9;

// POR ESTO (obtener del localStorage/session):
const getUserData = () => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export default function HistoriaClinicaPage({ 
  params 
}: { 
  params: Promise<{ paciente_id: string }> 
}) {
  const resolvedParams = use(params);
  const pacienteId = parseInt(resolvedParams.paciente_id);
  
  // AGREGAR ESTAS LÍNEAS:
  const [user, setUser] = useState<any>(null);
  const [consultaCreada, setConsultaCreada] = useState(false);
  const [turnoId, setTurnoId] = useState<number | null>(null);
  
  const [hcData, setHcData] = useState<HistoriaClinicaCompleta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  // Estados para modales
  const [showAntecedentesModal, setShowAntecedentesModal] = useState(false);
  const [showConsultaModal, setShowConsultaModal] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
    
    // Si vienes desde un turno, obtener el turno_id de la URL
    const searchParams = new URLSearchParams(window.location.search);
    const turno = searchParams.get('turno_id');
    if (turno) {
      setTurnoId(parseInt(turno));
    }
  }, []);

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
    if (!hcData || !user) {
      alert('Error: No se pudo identificar al profesional o la historia clínica');
      return;
    }
    
    setIsFormLoading(true);
    
    const payload = {
      ...formData,
      historia_id: hcData.historia_id,
      profesional_id: user.profesionalId,
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
      
      // AGREGAR ESTAS LÍNEAS:
      const result = await res.json();
      setConsultaCreada(true);
      
      alert('✅ Consulta registrada con éxito. Ahora puedes finalizar la atención.');
      await cargarHistoriaClinica(); 
      
    } catch (err) {
      alert('❌ Error al registrar la consulta: ' + (err as Error).message);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleFinalizarConsulta = async () => {
    if (!turnoId) {
      alert('❌ No se encontró un turno asociado a esta consulta');
      return;
    }
    
    const confirmar = window.confirm(
      '¿Está seguro que desea finalizar la consulta y marcar el turno como atendido?\n\nEsto cerrará la historia clínica y volverá a la agenda.'
    );
    
    if (!confirmar) return;
    
    setIsFormLoading(true);
    
    try {
      const res = await fetch(`/api/turnos/${turnoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'atendido' })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar el estado del turno');
      }
      
      alert('✅ Consulta finalizada exitosamente. El turno ha sido marcado como atendido.');
      
      // Redirigir a la agenda diaria
      window.location.href = '/agendadiaria';
      
    } catch (err) {
      alert('❌ Error al finalizar consulta: ' + (err as Error).message);
      setIsFormLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center text-lg">Cargando información del profesional...</div>;
  }

  if (isLoading) return <div className="p-8 text-center text-lg">Cargando Historia Clínica...</div>;
  if (error) return <div className="p-8 text-center text-xl text-red-600">Error: {error}</div>;
  if (!hcData) return <div className="p-8 text-center text-xl text-gray-500">Historia Clínica no encontrada.</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header con información del paciente */}
      <div className="bg-gradient-to-r from-[#2e75d4] to-[#8ddee1] text-white rounded-xl shadow-lg p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          title="Cerrar Historia Clínica"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-start justify-between pr-12">
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
          
          {/* MODIFICAR ESTE BLOQUE: */}
          <div className="bg-white/10 rounded-lg p-3 text-right">
            <p className="text-xs text-white/70 uppercase font-semibold">Profesional</p>
            <p className="text-sm font-medium mt-1">{user.nombre}</p>
            <p className="text-xs text-white/80">{user.profesionNombre}</p>
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
        
        <button
          onClick={handleFinalizarConsulta}
          disabled={isFormLoading || !turnoId}
          className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          title={!turnoId ? 'No hay turno asociado a esta consulta' : 'Finalizar consulta y marcar turno como atendido'}
        >
          <CheckCircle className="w-5 h-5" />
          {isFormLoading ? 'Finalizando...' : 'Finalizar Consulta'}
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
              <ConsultasList 
                consultas={hcData.consultas} 
                profesionalId={user.profesionalId}
              />
            )}
          </div>
        )}
      </div>
      <AntecedentesModal
        isOpen={showAntecedentesModal}
        onClose={() => setShowAntecedentesModal(false)}
        data={hcData}
        onSubmit={handleActualizarAntecedentes}
        isLoading={isFormLoading}
        profesionNombre={user.profesionNombre}
      />

      <NuevaConsultaModal
        isOpen={showConsultaModal}
        onClose={() => {
          setShowConsultaModal(false);
          setConsultaCreada(false);
        }}
        onSubmit={handleGuardarNuevaConsulta}
        isLoading={isFormLoading}
        consultaCreada={consultaCreada}
        onFinalizarConsulta={turnoId ? handleFinalizarConsulta : undefined}
      />
    </div>
  );
}