// hooks/useTurnos.ts
"use client";

import { useState, useEffect } from "react";
import { Turno, Paciente, Profesional } from "@/types/turnos";

export function useTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [isLoadingTurnos, setIsLoadingTurnos] = useState(true);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);

  const cargarTurnos = async () => {
    setIsLoadingTurnos(true);
    try {
      const res = await fetch("/api/turnos");
      const data: Turno[] = await res.json();

      data.sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());
      setTurnos(data);
    } catch (error) {
      console.error("Error cargando turnos", error);
      alert("Error al cargar los turnos");
    } finally {
      setIsLoadingTurnos(false);
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

  useEffect(() => {
    cargarTurnos();
    cargarPacientes();
    cargarProfesionales();
  }, []);

  return {
    turnos,
    isLoadingTurnos,
    pacientes,
    profesionales,
    refetchTurnos: cargarTurnos,
  };
}