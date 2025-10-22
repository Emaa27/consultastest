// types/turnos.ts

export type Turno = {
  turno_id: number;
  profesional_id: number;
  paciente_id: number;
  profesionales: {
    matricula: string;
    usuarios: { nombre: string; apellido: string };
    profesiones: { nombre: string };
  };
  pacientes: { nombre: string; apellido: string; documento: string };
  inicio: string | Date;
  fin: string | null;
  duracion_min: number;
  estado: string;
  obra_social_id: number | null;
};

export type Paciente = {
  paciente_id: number;
  nombre: string;
  apellido: string;
  documento: string;
  estado?: string;
};

export type Profesional = {
  profesional_id: number;
  matricula: string;
  usuarios: { nombre: string; apellido: string };
  profesiones: { nombre: string };
  estado?: string;
};

export type Agenda = {
  profesional_id: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  slot_min: number;
};

export type ComboItem = {
  value: string;
  label: string;
  keywords?: string;
};