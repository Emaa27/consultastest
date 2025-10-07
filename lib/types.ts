export type HistoriaClinicaBase = {
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

export type DiagnosticoDetalle = {
    diagnostico_id: number;
    juicio_clinico: string;
    diagnostico_presuntivo: string | null;
    indicacion_terapeutica: string | null;
}

export type ConsultaDetalle = {
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

export type HistoriaClinicaCompleta = HistoriaClinicaBase & {
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