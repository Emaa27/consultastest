'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { User, Edit, PlusCircle, Clock, Save, X } from 'lucide-react'; 

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

const PROFESIONAL_ID = 8;

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
  const [isEditingAntecedentes, setIsEditingAntecedentes] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  // Estado para datos del profesional actual
  const [profesionalActual, setProfesionalActual] = useState<any>(null);

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
        setIsEditingAntecedentes(false);
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
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl shadow-lg p-6">
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
          
          {/* Información del profesional actual */}
          <div className="bg-white/10 rounded-lg p-3 text-right">
            <p className="text-xs text-white/70 uppercase font-semibold">Profesional Actual</p>
            <p className="text-sm font-medium mt-1">ID: {PROFESIONAL_ID}</p>
            <p className="text-xs text-white/80 mt-1">
              (Implementar datos completos con autenticación)
            </p>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-xl font-semibold text-gray-800">📋 Antecedentes y Filiación</h2>
              {!isEditingAntecedentes && (
                <button 
                    onClick={() => setIsEditingAntecedentes(true)}
                    className="px-4 py-2 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-1"
                >
                    <Edit className="w-4 h-4" /> {hcData.grupo_sanguineo ? 'Editar' : 'Completar'}
                </button>
              )}
          </div>

          {isEditingAntecedentes ? (
              <AntecedentesForm 
                  initialData={hcData} 
                  onSubmit={handleActualizarAntecedentes}
                  onCancel={() => setIsEditingAntecedentes(false)}
                  isLoading={isFormLoading}
              />
          ) : (
              <AntecedentesReadOnly data={hcData} />
          )}
        </div>
        
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border-2 border-orange-400 h-fit sticky top-6">
          <h2 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2 border-b pb-3">
            <PlusCircle className="w-5 h-5" /> Registrar Nueva Consulta
          </h2>
          <NuevaConsultaForm 
             onSubmit={handleGuardarNuevaConsulta} 
             isLoading={isFormLoading}
          />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-gray-600" /> Historial de Consultas ({hcData.consultas.length})
          </h2>
          {hcData.consultas.length === 0 ? (
              <p className="text-gray-500">Este paciente aún no tiene consultas registradas.</p>
          ) : (
              <ConsultasList consultas={hcData.consultas} />
          )}
      </div>
    </div>
  );
}

const AntecedentesForm = ({ initialData, onSubmit, onCancel, isLoading }: {
    initialData: HistoriaClinicaBase,
    onSubmit: (data: HistoriaClinicaBase) => void,
    onCancel: () => void,
    isLoading: boolean
}) => {
    const [formState, setFormState] = useState<HistoriaClinicaBase>(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let newValue: any = value;
        
        if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        }
        
        setFormState({ ...formState, [name]: newValue });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formState);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
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
                        <input id="tabaco" type="checkbox" name="consume_tabaco" checked={formState.consume_tabaco} onChange={handleChange} className="w-4 h-4 text-orange-600" />
                        <label htmlFor="tabaco" className="ml-2 text-sm font-medium text-gray-900">Consume Tabaco</label>
                    </div>
                    <div className="flex items-center">
                        <input id="alcohol" type="checkbox" name="consume_alcohol" checked={formState.consume_alcohol} onChange={handleChange} className="w-4 h-4 text-orange-600" />
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
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                    {isLoading ? 'Guardando...' : <><Save className="w-4 h-4" /> Guardar</>}
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

const AntecedentesReadOnly = ({ data }: { data: HistoriaClinicaBase }) => {
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
                    <p className="text-xs font-semibold uppercase text-orange-600">{field.label}</p>
                    <p className="text-sm text-gray-800">{field.value || '— No especificado'}</p>
                </div>
            ))}
        </div>
    );
};

const NuevaConsultaForm = ({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) => {
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
                disabled={isLoading}
                className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isLoading ? 'Registrando...' : <><Save className="w-5 h-5" /> Registrar Consulta</>}
            </button>
        </form>
    );
};

const ConsultasList = ({ consultas }: { consultas: ConsultaDetalle[] }) => {
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
            window.location.reload();
        } catch (err: any) {
            alert('❌ ' + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-4">
            {consultas.map((c) => {
                const diagnostico = c.diagnosticos[0];
                const esAutor = c.profesional.profesional_id === PROFESIONAL_ID;
                const estaEditando = editingId === c.consulta_id;
                
                return (
                    <div key={c.consulta_id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        <div className="flex justify-between items-start border-b pb-2 mb-2">
                            <span className="text-sm font-bold text-orange-600">
                                Consulta #{c.consulta_id} - {new Date(c.fecha_consulta).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                                Dr. {c.profesional.usuarios.nombre} {c.profesional.usuarios.apellido}
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