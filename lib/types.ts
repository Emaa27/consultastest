// types.ts - Tipos actualizados con soporte para diagnósticos y medicamentos

export type HistoriaClinicaBase = {
  historia_id: number;
  paciente_id: number;
  medico_cabecera_id: number | null;
  sexo: string | null;
  grupo_sanguineo: string | null;
  estado_civil: string | null;
  ocupacion: string | null;
  peso: number | null;
  altura: number | null;
  enfermedades_infancia: string | null;
  enfermedades_cronicas: string | null;
  cirugias: string | null;
  alergias: string | null;
  medicamentos_actuales: string | null;
  consume_tabaco: boolean;
  consume_alcohol: boolean;
  actividad_fisica: string | null;
};

export type Paciente = {
  paciente_id: number;
  documento: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  genero: string | null;
  email: string | null;
  telefono: string | null;
};

export type MedicoCabecera = {
  profesional_id: number;
  usuarios: {
    nombre: string;
    apellido: string;
    email: string | null;
  };
};

export type Consulta = {
  consulta_id: number;
  historia_id: number;
  profesional_id: number;
  fecha_consulta: string;
  motivo_consulta: string;
  sintomas: string | null;
  diagnostico: string | null;
  tratamiento: string | null;
  observaciones: string | null;
  profesionales: {
    usuarios: {
      nombre: string;
      apellido: string;
    };
  };
};

export type HistoriaClinicaCompleta = HistoriaClinicaBase & {
  pacientes: Paciente;
  medico_cabecera: MedicoCabecera | null;
  consultas: ConsultaDetalle[];
};

export type UserData = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  profesionalId: number;
  profesionNombre: string;
  profesionId: number;
};

// Tipos para medicamentos
export type Medicamento = {
  medicamento_id: number;
  droga: string;
  via_administracion: string;
  dosis: string;
  frecuencia?: string | null;
};

// Tipos para diagnósticos
export type Diagnostico = {
  diagnostico_id: number;
  juicio_clinico?: string | null;
  diagnostico_presuntivo?: string | null;
  indicacion_terapeutica?: string | null;
  requiere_derivacion?: boolean;
  especialidad_derivacion?: string | null;
  medicamentos?: Medicamento[];
};

// Tipo detallado para consultas individuales con diagnósticos (PLURAL)
export type ConsultaDetalle = {
  consulta_id: number;
  historia_id: number;
  profesional_id: number;
  fecha_consulta: string;
  motivo_consulta: string;
  enfermedad_actual?: string | null;
  sintomas: string | null;
  diagnostico: string | null;
  tratamiento: string | null;
  observaciones: string | null;
  notas_evolucion: string | null;
  profesionales?: {
    profesional_id: number;
    usuarios: {
      usuario_id?: number;
      nombre: string;
      apellido: string;
      email?: string | null;
    };
    profesiones?: {
      profesion_id: number;
      nombre: string;
    };
  };
  diagnosticos: Diagnostico[]; // ✅ PLURAL - Este es el correcto
};