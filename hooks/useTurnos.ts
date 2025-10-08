// hooks/useTurnos.ts
"use client";

import { useState, useEffect } from "react";
import { Turno, Paciente, Profesional } from "@/types/turnos";

type ObraSocial = {
  obra_social_id: number;
  nombre: string;
};

export function useTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [isLoadingTurnos, setIsLoadingTurnos] = useState(true);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);

  const cargarTurnos = async (silencioso = false) => {
    if (!silencioso) setIsLoadingTurnos(true);
    try {
      const res = await fetch("/api/turnos");
      const data: Turno[] = await res.json();

      data.sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());
      setTurnos(data);
    } catch (error) {
      console.error("Error cargando turnos", error);
      if (!silencioso) alert("Error al cargar los turnos");
    } finally {
      if (!silencioso) setIsLoadingTurnos(false);
    }
  };

  const cargarPacientes = async () => {
    try {
      const res = await fetch("/api/pacientes");
      const data = await res.json();
      setPacientes(data);
    } catch (error) {
      console.error("Error cargando pacientes", error);
    }
  };

  const cargarProfesionales = async () => {
    try {
      const res = await fetch("/api/profesionales");
      const data = await res.json();
      setProfesionales(data);
    } catch (error) {
      console.error("Error cargando profesionales", error);
    }
  };

  const cargarObrasSociales = async () => {
    try {
      const res = await fetch("/api/obras_sociales");
      const data = await res.json();
      setObrasSociales(data);
    } catch (error) {
      console.error("Error cargando obras sociales", error);
    }
  };

  // Carga inicial
  useEffect(() => {
    cargarTurnos();
    cargarPacientes();
    cargarProfesionales();
    cargarObrasSociales();
  }, []);

  // Polling: recargar turnos cada 30 segundos (silencioso)
  useEffect(() => {
    const intervalo = setInterval(() => {
      cargarTurnos(true); // true = silencioso, no muestra loading
    }, 30000); // 30 segundos

    return () => clearInterval(intervalo);
  }, []);

  return {
    turnos,
    isLoadingTurnos,
    pacientes,
    profesionales,
    obrasSociales,
    refetchTurnos: cargarTurnos,
  };
}